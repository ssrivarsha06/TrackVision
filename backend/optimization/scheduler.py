import os
import sys
import pandas as pd
from datetime import datetime, timedelta
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'ml')))
from use_model import RailwayDelayPredictor

def load_data(dataset_path, num_trains=8):
    """Load dataset and extract subset of trains"""
    df = pd.read_csv(dataset_path)
    logger.info(f"Total rows in dataset: {len(df)}")
    
    # Get unique train numbers and train types for better variety
    unique_trains = df['Train No'].unique()[:num_trains]
    subset_df = df[df['Train No'].isin(unique_trains)].copy()
    
    logger.info(f"Selected {len(subset_df)} rows for {len(unique_trains)} trains")
    logger.info(f"Available train types in dataset: {df['Train Type'].unique()}")
    return subset_df

def parse_time(time_str):
    """Parse time in either 'HH:MM', 'HHMM', or 'H:MM' format"""
    time_str = str(time_str).strip()
    
    if ':' in time_str:
        # Format: "H:MM" or "HH:MM"
        parts = time_str.split(':')
        hour = int(parts[0]) if parts[0] else 0
        minute = int(parts[1]) if len(parts) > 1 and parts[1] else 0
    else:
        # Format: "HHMM" or "HMM"
        if len(time_str) == 3:  # e.g., "800" = "8:00"
            time_str = '0' + time_str
        time_str = time_str.zfill(4)
        hour = int(time_str[:2]) if len(time_str) >= 2 else 0
        minute = int(time_str[2:4]) if len(time_str) >= 4 else 0
    
    return hour, minute

def prepare_train_data(df, predictor):
    """Prepare train data with predicted delays for optimization"""
    train_data = []
    grouped = df.groupby('Train No')
    
    for train_no, group in grouped:
        # Use first row for static train features
        row = group.iloc[0]

        # Parse arrival and departure times with improved error handling
        arrival_time = str(row['Arrival time']) if pd.notna(row['Arrival time']) else '12:00'
        departure_time = str(row['Departure Time']) if pd.notna(row['Departure Time']) else '13:00'
        
        try:
            arrival_hour, arrival_minutes = parse_time(arrival_time)
            departure_hour, departure_minutes = parse_time(departure_time)
        except (ValueError, IndexError) as e:
            logger.warning(f"Error parsing time for train {train_no}: {e}. Using defaults.")
            arrival_hour, arrival_minutes = 12, 0
            departure_hour, departure_minutes = 13, 0

        input_data = {
            'Arrival_Hour': arrival_hour,
            'Departure_Hour': departure_hour,
            'Distance': float(row['Distance']) if pd.notna(row['Distance']) else 50.0,
            'Source Station': str(row['Source Station']),
            'Source Station Name': str(row['Source Station Name']),
            'Destination Station': str(row['Destination Station']),
            'Destination Station Name': str(row['Destination Station Name']),
            'Train Type': str(row['Train Type']),
            'Weather': str(row['Weather']) if pd.notna(row['Weather']) else 'Clear',
            'IsHoliday': int(row['IsHoliday']) if pd.notna(row['IsHoliday']) else 0,
            'Congestion': str(row['Congestion']) if pd.notna(row['Congestion']) else '2',
        }

        try:
            delay = predictor.predict_delay(input_data)
        except Exception as e:
            logger.error(f"Error predicting delay for train {train_no}: {e}")
            delay = 5.0  # Default delay

        # Enhanced priority mapping based on train types found in your dataset
        train_type = str(row['Train Type']).upper()
        if 'EXPRESS' in train_type or 'SUPERFAST' in train_type:
            priority = 1  # Highest priority
        elif 'PASSENGER' in train_type or 'LOCAL' in train_type:
            priority = 3  # Lowest priority
        else:  # EMU, Other, etc.
            priority = 2  # Medium priority

        # Extract train name for better identification
        train_name = str(row['Train Name']) if 'Train Name' in row else f"Train {train_no}"

        logger.info(f"Train {train_no} ({train_name}) - Type: {train_type} - Priority: {priority} - Predicted delay: {delay:.2f} min")

        train_data.append({
            'train_no': train_no,
            'train_name': train_name,
            'train_type': train_type,
            'scheduled_arrival_hour': arrival_hour,
            'scheduled_arrival_minute': arrival_minutes,
            'scheduled_departure_hour': departure_hour,
            'scheduled_departure_minute': departure_minutes,
            'platform_no': int(row['Platform No']) if pd.notna(row['Platform No']) else 1,
            'priority': priority,
            'predicted_delay': float(delay),
            'source': str(row['Source Station Name']),
            'destination': str(row['Destination Station Name']),
            'distance': float(row['Distance']) if pd.notna(row['Distance']) else 50.0,
            'weather': str(row['Weather']) if pd.notna(row['Weather']) else 'Clear'
        })

    logger.info(f"Prepared data for {len(train_data)} trains with predicted delays")
    return train_data

def calculate_actual_times(train_data):
    """Calculate actual arrival/departure times including delays"""
    for train in train_data:
        # Convert scheduled times to minutes since midnight
        scheduled_arrival_minutes = train['scheduled_arrival_hour'] * 60 + train['scheduled_arrival_minute']
        scheduled_departure_minutes = train['scheduled_departure_hour'] * 60 + train['scheduled_departure_minute']
        
        # Add delay to get actual times
        actual_arrival_minutes = scheduled_arrival_minutes + train['predicted_delay']
        actual_departure_minutes = scheduled_departure_minutes + train['predicted_delay']
        
        train['actual_arrival_minutes'] = actual_arrival_minutes
        train['actual_departure_minutes'] = actual_departure_minutes
        
    return train_data

def check_platform_conflicts(train_data):
    """Check for platform conflicts and calculate separation times"""
    conflicts = []
    platform_groups = {}
    
    # Group trains by platform
    for train in train_data:
        platform = train['platform_no']
        if platform not in platform_groups:
            platform_groups[platform] = []
        platform_groups[platform].append(train)
    
    # Check conflicts within each platform
    for platform, trains in platform_groups.items():
        if len(trains) > 1:
            # Sort trains by actual arrival time
            trains.sort(key=lambda x: x['actual_arrival_minutes'])
            
            for i in range(len(trains) - 1):
                current_train = trains[i]
                next_train = trains[i + 1]
                
                # Calculate time gap between trains (assuming 15 min dwell time)
                current_departure = current_train['actual_departure_minutes'] + 15  # buffer
                next_arrival = next_train['actual_arrival_minutes']
                
                time_gap = next_arrival - current_departure
                
                if time_gap < 10:  # Minimum 10 minutes separation required
                    conflicts.append({
                        'platform': platform,
                        'train1': current_train['train_no'],
                        'train1_name': current_train['train_name'],
                        'train2': next_train['train_no'],
                        'train2_name': next_train['train_name'],
                        'time_gap': time_gap,
                        'conflict_severity': 'HIGH' if time_gap < 0 else 'MEDIUM'
                    })
    
    return conflicts

def advanced_greedy_scheduling(train_data):
    """Advanced greedy scheduling with comprehensive optimization"""
    logger.info(f"Starting advanced scheduling optimization for {len(train_data)} trains")
    
    # Calculate actual times including delays
    train_data = calculate_actual_times(train_data)
    
    # Check for platform conflicts before optimization
    conflicts = check_platform_conflicts(train_data)
    logger.info(f"Found {len(conflicts)} potential platform conflicts")
    
    # Multi-criteria sorting:
    # 1. Priority (1=Express, 2=EMU/Other, 3=Passenger)
    # 2. Predicted delay (lower is better)
    # 3. Distance (longer distances get preference for efficiency)
    # 4. Scheduled arrival time (earlier is better)
    sorted_trains = sorted(train_data, key=lambda x: (
        x['priority'],                    # Primary: Priority
        x['predicted_delay'],            # Secondary: Delay
        -x['distance'],                  # Tertiary: Distance (negative for desc order)
        x['scheduled_arrival_hour'] * 60 + x['scheduled_arrival_minute']  # Quaternary: Time
    ))
    
    # Assign order based on sorting
    result = []
    for order, train in enumerate(sorted_trains):
        result.append({
            'train_no': train['train_no'],
            'train_name': train['train_name'],
            'train_type': train['train_type'],
            'order': order,
            'platform_no': train['platform_no'],
            'priority': train['priority'],
            'predicted_delay': train['predicted_delay'],
            'distance': train['distance'],
            'weather': train['weather'],
            'scheduled_arrival': f"{train['scheduled_arrival_hour']:02d}:{train['scheduled_arrival_minute']:02d}",
            'scheduled_departure': f"{train['scheduled_departure_hour']:02d}:{train['scheduled_departure_minute']:02d}",
            'actual_arrival_time': f"{int(train['actual_arrival_minutes']//60):02d}:{int(train['actual_arrival_minutes']%60):02d}",
            'actual_departure_time': f"{int(train['actual_departure_minutes']//60):02d}:{int(train['actual_departure_minutes']%60):02d}",
            'source': train['source'],
            'destination': train['destination']
        })
    
    logger.info("Advanced scheduling optimization completed successfully")
    return result, conflicts

def main():
    logger.info("Starting intelligent train scheduling optimization...")

    base_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
    dataset_path = os.path.join(base_path, 'final_dataset.csv')
    model_path = os.path.join(base_path, 'backend', 'ml', 'train_delay_model.pkl')

    try:
        predictor = RailwayDelayPredictor()
        predictor.load_model(model_path)

        df = load_data(dataset_path, num_trains=8)  # Increased to 8 trains for better demonstration
        train_data = prepare_train_data(df, predictor)

        optimized_schedule, conflicts = advanced_greedy_scheduling(train_data)

        print("\n" + "="*100)
        print("🚂 INTELLIGENT TRAIN SCHEDULING OPTIMIZATION RESULTS")
        print("="*100)
        
        # Display optimized schedule with enhanced information
        print(f"\n📋 OPTIMIZED SCHEDULE (Priority: 1=Express, 2=EMU/Other, 3=Passenger)")
        print("-"*100)
        for entry in optimized_schedule:
            priority_labels = {1: "EXPRESS", 2: "EMU/OTHER", 3: "PASSENGER"}
            priority_label = priority_labels.get(entry['priority'], "UNKNOWN")
            
            # Safe string conversion for train_type
            train_type = str(entry['train_type'])
            
            print(f"🚆 Order: {entry['order'] + 1:2d} | Train: {entry['train_no']} ({entry['train_name'][:30]})")
            print(f"   Type: {train_type:<15} | Priority: {priority_label:<12} | Platform: {entry['platform_no']}")
            print(f"   Route: {entry['source']} → {entry['destination']}")
            print(f"   Distance: {entry['distance']:.0f}km | Weather: {entry['weather']} | Delay: {entry['predicted_delay']:.1f} min")
            print(f"   Scheduled: {entry['scheduled_arrival']} → {entry['scheduled_departure']}")
            print(f"   With Delay: {entry['actual_arrival_time']} → {entry['actual_departure_time']}")
            print()

        # Display platform conflicts with enhanced details
        if conflicts:
            print("⚠️  PLATFORM CONFLICTS DETECTED:")
            print("-"*60)
            for conflict in conflicts:
                print(f"🔴 Platform {conflict['platform']}: {conflict['conflict_severity']} RISK")
                print(f"   Train {conflict['train1']} ({conflict['train1_name'][:20]}) vs")
                print(f"   Train {conflict['train2']} ({conflict['train2_name'][:20]})")
                print(f"   Time gap: {conflict['time_gap']:.1f} minutes")
                print()
        else:
            print("✅ NO PLATFORM CONFLICTS DETECTED")

        # Summary statistics
        avg_delay = sum(e['predicted_delay'] for e in optimized_schedule) / len(optimized_schedule)
        total_distance = sum(e['distance'] for e in optimized_schedule)
        
        print("-"*100)
        print(f"📊 SUMMARY: {len(optimized_schedule)} trains optimized | Average delay: {avg_delay:.1f} min | Total distance: {total_distance:.0f}km")
        print("="*100)
        
    except Exception as e:
        logger.error(f"Error in main execution: {e}")
        print(f"❌ Error occurred: {e}")

if __name__ == '__main__':
    main()

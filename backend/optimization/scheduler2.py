import os
import sys
import json
import pandas as pd
from datetime import datetime, timedelta
import logging
from itertools import permutations
import copy
from collections import defaultdict
import random

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'ml')))
from use_model import RailwayDelayPredictor

class ControlStationSimulator:
    def __init__(self):
        self.predictor = None
        
    def load_predictor(self, model_path):
        """Load the ML predictor model"""
        self.predictor = RailwayDelayPredictor()
        self.predictor.load_model(model_path)
        
    def generate_all_scenarios(self, train_data):
        """Generate all possible scheduling scenarios for control station"""
        logger.info("Generating all possible scheduling scenarios...")
        
        scenarios = []
        
        # Scenario 1: Default Schedule (Original Timetable Order)
        scenarios.append(self._create_default_schedule(train_data))
        
        # Scenario 2: ML Optimized Schedule
        scenarios.append(self._create_optimized_schedule(train_data))
        
        # Scenario 3: Priority-Based Schedules
        scenarios.extend(self._create_priority_schedules(train_data))
        
        # Scenario 4: Delay-Based Schedules
        scenarios.extend(self._create_delay_schedules(train_data))
        
        # Scenario 5: Platform-Based Schedules
        scenarios.extend(self._create_platform_schedules(train_data))
        
        # Scenario 6: Custom Order Scenarios (What-if specific train goes first)
        scenarios.extend(self._create_custom_order_scenarios(train_data))
        
        # Scenario 7: Alternative Routing Scenarios
        scenarios.extend(self._create_alternative_routing_scenarios(train_data))
        
        logger.info(f"Generated {len(scenarios)} total scenarios for control station")
        return scenarios
    
    def _create_default_schedule(self, train_data):
        """Original timetable order"""
        schedule = copy.deepcopy(train_data)
        schedule.sort(key=lambda x: x['scheduled_arrival_hour'] * 60 + x['scheduled_arrival_minute'])
        
        for i, train in enumerate(schedule):
            train['order'] = i + 1
            
        return {
            'scenario_id': 'DEFAULT',
            'scenario_name': 'Default Timetable Order',
            'description': 'Original scheduled order based on arrival times',
            'schedule': schedule,
            'use_case': 'Normal operations, no disruptions'
        }
    
    def _create_optimized_schedule(self, train_data):
        """ML-optimized schedule"""
        schedule = copy.deepcopy(train_data)
        schedule.sort(key=lambda x: (
            x['priority'],
            x['predicted_delay'], 
            -x['distance'],
            x['scheduled_arrival_hour'] * 60 + x['scheduled_arrival_minute']
        ))
        
        for i, train in enumerate(schedule):
            train['order'] = i + 1
            
        return {
            'scenario_id': 'ML_OPTIMIZED',
            'scenario_name': 'ML Optimized Schedule',
            'description': 'AI-optimized based on priority, delay prediction, and distance',
            'schedule': schedule,
            'use_case': 'Optimal performance under normal conditions'
        }
    
    def _create_priority_schedules(self, train_data):
        """Different priority-based scenarios"""
        scenarios = []
        
        # Express trains first
        schedule1 = copy.deepcopy(train_data)
        express_trains = [t for t in schedule1 if t['priority'] == 1]
        other_trains = [t for t in schedule1 if t['priority'] != 1]
        combined = express_trains + sorted(other_trains, key=lambda x: x['predicted_delay'])
        
        for i, train in enumerate(combined):
            train['order'] = i + 1
            
        scenarios.append({
            'scenario_id': 'EXPRESS_FIRST',
            'scenario_name': 'Express Trains Priority',
            'description': 'All express trains scheduled first, then others by delay',
            'schedule': combined,
            'use_case': 'When express train punctuality is critical'
        })
        
        # Local trains first
        schedule2 = copy.deepcopy(train_data)
        local_trains = [t for t in schedule2 if t['priority'] == 3]
        other_trains = [t for t in schedule2 if t['priority'] != 3]
        combined = local_trains + sorted(other_trains, key=lambda x: x['predicted_delay'])
        
        for i, train in enumerate(combined):
            train['order'] = i + 1
            
        scenarios.append({
            'scenario_id': 'LOCAL_FIRST',
            'scenario_name': 'Local Trains Priority',
            'description': 'Local trains scheduled first to clear local traffic',
            'schedule': combined,
            'use_case': 'During peak hours to manage local commuter traffic'
        })
        
        return scenarios
    
    def _create_delay_schedules(self, train_data):
        """Delay-based scheduling scenarios"""
        scenarios = []
        
        # Minimum delay first
        schedule1 = copy.deepcopy(train_data)
        schedule1.sort(key=lambda x: x['predicted_delay'])
        for i, train in enumerate(schedule1):
            train['order'] = i + 1
            
        scenarios.append({
            'scenario_id': 'MIN_DELAY_FIRST',
            'scenario_name': 'Minimum Delay First',
            'description': 'Trains with lowest predicted delays scheduled first',
            'schedule': schedule1,
            'use_case': 'When overall punctuality is the main concern'
        })
        
        # Maximum delay first
        schedule2 = copy.deepcopy(train_data)
        schedule2.sort(key=lambda x: -x['predicted_delay'])
        for i, train in enumerate(schedule2):
            train['order'] = i + 1
            
        scenarios.append({
            'scenario_id': 'MAX_DELAY_FIRST',
            'scenario_name': 'Maximum Delay First',
            'description': 'Trains with highest delays scheduled first to clear backlog',
            'schedule': schedule2,
            'use_case': 'When clearing delayed trains is priority'
        })
        
        return scenarios
    
    def _create_platform_schedules(self, train_data):
        """Platform-based scheduling scenarios"""
        scenarios = []
        
        # Group by platform
        schedule1 = copy.deepcopy(train_data)
        schedule1.sort(key=lambda x: (x['platform_no'], x['predicted_delay']))
        for i, train in enumerate(schedule1):
            train['order'] = i + 1
            
        scenarios.append({
            'scenario_id': 'PLATFORM_GROUPED',
            'scenario_name': 'Platform Grouped Schedule',
            'description': 'Trains grouped by platform to minimize conflicts',
            'schedule': schedule1,
            'use_case': 'When platform conflicts are causing major delays'
        })
        
        # Platform load balancing
        schedule2 = copy.deepcopy(train_data)
        platform_counts = defaultdict(int)
        for train in schedule2:
            platform_counts[train['platform_no']] += 1
        
        # Distribute trains more evenly across platforms
        available_platforms = list(range(1, 7))  # Platforms 1-6
        for train in schedule2:
            current_platform = train['platform_no']
            # Find less crowded platform
            min_platform = min(available_platforms, key=lambda p: platform_counts.get(p, 0))
            if platform_counts[min_platform] < platform_counts[current_platform] - 1:
                train['original_platform'] = current_platform
                train['platform_no'] = min_platform
                train['platform_changed'] = True
                platform_counts[current_platform] -= 1
                platform_counts[min_platform] += 1
        
        schedule2.sort(key=lambda x: x['predicted_delay'])
        for i, train in enumerate(schedule2):
            train['order'] = i + 1
            
        scenarios.append({
            'scenario_id': 'PLATFORM_BALANCED',
            'scenario_name': 'Platform Load Balanced',
            'description': 'Trains redistributed across platforms for load balancing',
            'schedule': schedule2,
            'use_case': 'When certain platforms are overcrowded'
        })
        
        return scenarios
    
    def _create_custom_order_scenarios(self, train_data):
        """Custom order scenarios - what if specific train goes first"""
        scenarios = []
        
        # What if each train goes first
        for target_train in train_data:
            schedule = copy.deepcopy(train_data)
            
            # Move target train to first position
            target_train_copy = None
            remaining_trains = []
            
            for train in schedule:
                if train['train_no'] == target_train['train_no']:
                    target_train_copy = train
                else:
                    remaining_trains.append(train)
            
            # Sort remaining trains by delay
            remaining_trains.sort(key=lambda x: x['predicted_delay'])
            
            # Combine: target train first, then others
            final_schedule = [target_train_copy] + remaining_trains
            
            for i, train in enumerate(final_schedule):
                train['order'] = i + 1
                if i == 0:
                    train['forced_first'] = True
            
            scenarios.append({
                'scenario_id': f'TRAIN_{target_train["train_no"]}_FIRST',
                'scenario_name': f'Train {target_train["train_no"]} Goes First',
                'description': f'What if Train {target_train["train_no"]} ({target_train["train_name"]}) is prioritized first',
                'schedule': final_schedule,
                'use_case': f'Emergency priority for Train {target_train["train_no"]} or specific operational needs'
            })
        
        return scenarios
    
    def _create_alternative_routing_scenarios(self, train_data):
        """Alternative routing scenarios"""
        scenarios = []
        
        # Same track conflict resolution
        schedule1 = copy.deepcopy(train_data)
        
        # Identify trains that might use same track (same route)
        route_groups = defaultdict(list)
        for train in schedule1:
            route_key = f"{train['source']}-{train['destination']}"
            route_groups[route_key].append(train)
        
        # For routes with multiple trains, spread them out
        for route, trains in route_groups.items():
            if len(trains) > 1:
                # Sort by predicted delay
                trains.sort(key=lambda x: x['predicted_delay'])
                
                # Add time spacing between trains on same route
                for i, train in enumerate(trains):
                    if i > 0:
                        train['time_spacing_added'] = i * 10  # 10 min spacing
                        train['predicted_delay'] += train['time_spacing_added']
                        train['route_spacing_applied'] = True
        
        schedule1.sort(key=lambda x: x['predicted_delay'])
        for i, train in enumerate(schedule1):
            train['order'] = i + 1
            
        scenarios.append({
            'scenario_id': 'ROUTE_SPACED',
            'scenario_name': 'Same Route Trains Spaced',
            'description': 'Trains on same routes spaced out to avoid track conflicts',
            'schedule': schedule1,
            'use_case': 'When same-route trains are causing track congestion'
        })
        
        # Alternative platform assignment
        schedule2 = copy.deepcopy(train_data)
        for train in schedule2:
            # Simulate alternative platform assignment
            original_platform = train['platform_no']
            alternative_platforms = [p for p in range(1, 7) if p != original_platform]
            if alternative_platforms:
                train['alternative_platform'] = random.choice(alternative_platforms)
                train['platform_no'] = train['alternative_platform']
                train['original_platform'] = original_platform
                train['platform_reassigned'] = True
        
        schedule2.sort(key=lambda x: (x['platform_no'], x['predicted_delay']))
        for i, train in enumerate(schedule2):
            train['order'] = i + 1
            
        scenarios.append({
            'scenario_id': 'ALTERNATIVE_PLATFORMS',
            'scenario_name': 'Alternative Platform Assignment',
            'description': 'Trains reassigned to alternative platforms',
            'schedule': schedule2,
            'use_case': 'When original platforms have maintenance or issues'
        })
        
        return scenarios

def calculate_scenario_performance(schedule):
    """Calculate comprehensive performance metrics for each scenario"""
    metrics = {
        'total_trains': len(schedule),
        'total_delay': sum(train['predicted_delay'] for train in schedule),
        'avg_delay': sum(train['predicted_delay'] for train in schedule) / len(schedule),
        'max_delay': max(train['predicted_delay'] for train in schedule),
        'min_delay': min(train['predicted_delay'] for train in schedule),
        'platform_conflicts': 0,
        'express_trains_avg_position': 0,
        'passenger_satisfaction_score': 0,
        'efficiency_score': 0
    }
    
    # Platform conflict analysis
    platform_usage = defaultdict(list)
    for train in schedule:
        platform_usage[train['platform_no']].append(train)
    
    conflicts = 0
    for platform, trains in platform_usage.items():
        if len(trains) > 1:
            conflicts += len(trains) - 1  # Each additional train on same platform is a potential conflict
    
    metrics['platform_conflicts'] = conflicts
    
    # Express train positioning
    express_trains = [t for t in schedule if t['priority'] == 1]
    if express_trains:
        avg_pos = sum(t['order'] for t in express_trains) / len(express_trains)
        metrics['express_trains_avg_position'] = avg_pos
    
    # Passenger satisfaction (higher is better)
    delay_penalty = min(100, metrics['avg_delay'] * 2)  # Max penalty 100
    conflict_penalty = metrics['platform_conflicts'] * 5
    metrics['passenger_satisfaction_score'] = max(0, 100 - delay_penalty - conflict_penalty)
    
    # Efficiency score
    metrics['efficiency_score'] = max(0, 100 - metrics['avg_delay'] - metrics['platform_conflicts'] * 3)
    
    return metrics

def rank_scenarios(scenarios):
    """Rank scenarios by overall performance"""
    scenario_rankings = []
    
    for scenario in scenarios:
        metrics = calculate_scenario_performance(scenario['schedule'])
        
        # Calculate overall score
        overall_score = (
            metrics['passenger_satisfaction_score'] * 0.4 +
            metrics['efficiency_score'] * 0.3 +
            (100 - min(50, metrics['platform_conflicts'] * 10)) * 0.2 +
            (100 - min(50, metrics['express_trains_avg_position'] * 5)) * 0.1
        )
        
        scenario_rankings.append({
            'scenario': scenario,
            'metrics': metrics,
            'overall_score': overall_score,
            'rank': 0  # Will be assigned after sorting
        })
    
    # Sort by overall score (descending)
    scenario_rankings.sort(key=lambda x: x['overall_score'], reverse=True)
    
    # Assign ranks
    for i, ranking in enumerate(scenario_rankings):
        ranking['rank'] = i + 1
    
    return scenario_rankings

# [Keep your existing functions: load_data, parse_time, prepare_train_data]

def load_data(dataset_path, num_trains=8):
    """Load dataset and extract subset of trains"""
    df = pd.read_csv(dataset_path)
    logger.info(f"Total rows in dataset: {len(df)}")
    
    unique_trains = df['Train No'].unique()[:num_trains]
    subset_df = df[df['Train No'].isin(unique_trains)].copy()
    
    logger.info(f"Selected {len(subset_df)} rows for {len(unique_trains)} trains")
    return subset_df

def parse_time(time_str):
    """Parse time in either 'HH:MM', 'HHMM', or 'H:MM' format"""
    time_str = str(time_str).strip()
    
    if ':' in time_str:
        parts = time_str.split(':')
        hour = int(parts[0]) if parts[0] else 0
        minute = int(parts[1]) if len(parts) > 1 and parts[1] else 0
    else:
        if len(time_str) == 3:
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
        row = group.iloc[0]

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
            delay = 5.0

        train_type = str(row['Train Type']).upper()
        if 'EXPRESS' in train_type or 'SUPERFAST' in train_type:
            priority = 1
        elif 'PASSENGER' in train_type or 'LOCAL' in train_type:
            priority = 3
        else:
            priority = 2

        train_name = str(row['Train Name']) if 'Train Name' in row else f"Train {train_no}"

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

def main():
    logger.info("Starting Control Station Decision Support System...")
    
    base_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
    dataset_path = os.path.join(base_path, 'final_dataset.csv')
    model_path = os.path.join(base_path, 'backend', 'ml', 'train_delay_model.pkl')
    
    output_dir = os.path.join(base_path, 'control_station_output')
    os.makedirs(output_dir, exist_ok=True)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    try:
        # Initialize simulator
        simulator = ControlStationSimulator()
        simulator.load_predictor(model_path)
        
        # Load and prepare data
        df = load_data(dataset_path, num_trains=6)  # Using 6 trains for manageable scenarios
        train_data = prepare_train_data(df, simulator.predictor)
        
        # Generate all possible scenarios
        all_scenarios = simulator.generate_all_scenarios(train_data)
        
        # Rank scenarios by performance
        scenario_rankings = rank_scenarios(all_scenarios)
        
        # Create control station report
        control_station_report = {
            "metadata": {
                "generation_timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "total_scenarios": len(all_scenarios),
                "total_trains": len(train_data),
                "system": "Control Station Decision Support System"
            },
            "scenario_rankings": scenario_rankings,
            "train_data": train_data
        }
        
        # Save detailed report
        report_path = os.path.join(output_dir, f'control_station_scenarios_{timestamp}.json')
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(control_station_report, f, indent=2, ensure_ascii=False, default=str)
        
        # Display Control Station Dashboard
        print("\n" + "="*130)
        print("🎯 CONTROL STATION DECISION SUPPORT SYSTEM - ALL POSSIBLE SCENARIOS")
        print("="*130)
        
        print(f"\n📊 SCENARIO ANALYSIS COMPLETE")
        print(f"   Total Scenarios Generated: {len(all_scenarios)}")
        print(f"   Trains to Schedule: {len(train_data)}")
        print(f"   Analysis Time: {datetime.now().strftime('%H:%M:%S')}")
        
        print(f"\n🏆 TOP 5 RECOMMENDED SCENARIOS (Ranked by Performance)")
        print("-"*130)
        
        for i, ranking in enumerate(scenario_rankings[:5]):
            scenario = ranking['scenario']
            metrics = ranking['metrics']
            score = ranking['overall_score']
            
            rank_icon = ["🥇", "🥈", "🥉", "🏅", "⭐"][i]
            
            print(f"{rank_icon} RANK {ranking['rank']}: {scenario['scenario_name']} (ID: {scenario['scenario_id']})")
            print(f"   Description: {scenario['description']}")
            print(f"   Use Case: {scenario['use_case']}")
            print(f"   Performance: Avg Delay {metrics['avg_delay']:.1f}min | Conflicts {metrics['platform_conflicts']} | Score {score:.1f}")
            print()
        
        print(f"\n📋 ALL AVAILABLE SCENARIOS FOR CONTROL STATION:")
        print("-"*130)
        
        for ranking in scenario_rankings:
            scenario = ranking['scenario']
            metrics = ranking['metrics']
            
            status = "🟢 EXCELLENT" if ranking['rank'] <= 3 else "🟡 GOOD" if ranking['rank'] <= 7 else "🔴 NEEDS REVIEW"
            
            print(f"[{ranking['rank']:2d}] {scenario['scenario_id']:<20} | {scenario['scenario_name']:<30} | {status}")
            print(f"     Avg Delay: {metrics['avg_delay']:.1f}min | Platform Conflicts: {metrics['platform_conflicts']:2d} | Satisfaction: {metrics['passenger_satisfaction_score']:.0f}%")
            
        print(f"\n🎯 CONTROL STATION INSTRUCTIONS:")
        print(f"   1. SELECT ANY SCENARIO: Choose based on current operational needs")
        print(f"   2. LIVE SITUATION FACTORS: Consider weather, passenger load, maintenance")
        print(f"   3. IMPLEMENTATION: Apply selected scenario to train scheduling system")
        print(f"   4. MONITORING: Track performance and adjust if needed")
        
        print(f"\n📁 DETAILED SCENARIOS SAVED TO: {report_path}")
        print("="*130)
        
    except Exception as e:
        logger.error(f"Error in control station system: {e}")
        print(f"❌ System error: {e}")

if __name__ == '__main__':
    main()

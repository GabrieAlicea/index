-- Seeds the service catalog to match lib/data/services.ts so the database
-- and marketing site never drift while dispatch/booking runs on live data.

insert into service_categories (name, slug, icon, description, sort_order) values
  ('Maintenance', 'maintenance', 'oil', 'Routine maintenance performed in your driveway with OEM-spec fluids and parts.', 1),
  ('Brakes & Suspension', 'brakes-suspension', 'brakes', 'Pad, rotor, and full suspension work with a multi-point safety inspection.', 2),
  ('Battery & Electrical', 'battery-electrical', 'battery', 'Computer diagnostics, charging-system repair, and electrical troubleshooting.', 3),
  ('Tires & Wheels', 'tires-wheels', 'tires', 'Tire replacement, balancing, and rotation mounted curbside.', 4),
  ('Audio & Electronics', 'audio-electronics', 'electronics', 'Custom installs for speakers, amps, dash cams, remote start, and infotainment.', 5),
  ('Custom Repair', 'custom-repair', 'wrench', 'Anything else, quoted fair before any work or dispatch happens.', 6),
  ('Roadside Assistance', 'roadside-assistance', 'roadside', 'Lockouts, jump starts, flats, and fuel delivery.', 7);

insert into services (category_id, name, slug, base_price, price_type, duration_minutes) values
  ((select id from service_categories where slug = 'maintenance'), 'Oil Change (Synthetic)', 'oil-change-synthetic', 89, 'fixed', 45),
  ((select id from service_categories where slug = 'maintenance'), 'Spark Plug Replacement', 'spark-plug-replacement', 149, 'fixed', 60),
  ((select id from service_categories where slug = 'maintenance'), 'Belt Replacement', 'belt-replacement', 129, 'fixed', 60),
  ((select id from service_categories where slug = 'maintenance'), 'Radiator Service', 'radiator-service', 179, 'estimate', 90),
  ((select id from service_categories where slug = 'maintenance'), 'Coolant Flush', 'coolant-flush', 119, 'fixed', 45),
  ((select id from service_categories where slug = 'maintenance'), 'Transmission Fluid Service', 'transmission-fluid-service', 169, 'fixed', 60),
  ((select id from service_categories where slug = 'maintenance'), 'Differential Service', 'differential-service', 149, 'fixed', 60),
  ((select id from service_categories where slug = 'maintenance'), 'Tire Rotation', 'tire-rotation', 49, 'fixed', 30),

  ((select id from service_categories where slug = 'brakes-suspension'), 'Brake Pad & Rotor Replacement', 'brake-pad-rotor-replacement', 149, 'estimate', 90),
  ((select id from service_categories where slug = 'brakes-suspension'), 'Brake Fluid Bleed', 'brake-fluid-bleed', 99, 'fixed', 45),
  ((select id from service_categories where slug = 'brakes-suspension'), 'Suspension Inspection & Repair', 'suspension-inspection-repair', 179, 'estimate', 120),
  ((select id from service_categories where slug = 'brakes-suspension'), 'Control Arm Replacement', 'control-arm-replacement', 219, 'estimate', 120),
  ((select id from service_categories where slug = 'brakes-suspension'), 'Ball Joint Replacement', 'ball-joint-replacement', 189, 'estimate', 90),
  ((select id from service_categories where slug = 'brakes-suspension'), 'Tie Rod Replacement', 'tie-rod-replacement', 159, 'estimate', 90),
  ((select id from service_categories where slug = 'brakes-suspension'), 'Wheel Bearing Replacement', 'wheel-bearing-replacement', 199, 'estimate', 90),

  ((select id from service_categories where slug = 'battery-electrical'), 'Battery Replacement', 'battery-replacement', 119, 'fixed', 30),
  ((select id from service_categories where slug = 'battery-electrical'), 'Alternator Replacement', 'alternator-replacement', 259, 'estimate', 90),
  ((select id from service_categories where slug = 'battery-electrical'), 'Starter Replacement', 'starter-replacement', 249, 'estimate', 90),
  ((select id from service_categories where slug = 'battery-electrical'), 'Full Diagnostics Scan', 'full-diagnostics-scan', 99, 'fixed', 45),
  ((select id from service_categories where slug = 'battery-electrical'), 'Lights & Sensor Repair', 'lights-sensor-repair', 89, 'estimate', 45),
  ((select id from service_categories where slug = 'battery-electrical'), 'Electrical Repair', 'electrical-repair', null, 'quote_only', null),
  ((select id from service_categories where slug = 'battery-electrical'), 'Battery Load Testing', 'battery-load-testing', 39, 'fixed', 20),

  ((select id from service_categories where slug = 'tires-wheels'), 'Tire Replacement (per tire)', 'tire-replacement', 129, 'fixed', 30),
  ((select id from service_categories where slug = 'tires-wheels'), 'Tire Balancing', 'tire-balancing', 59, 'fixed', 30),
  ((select id from service_categories where slug = 'tires-wheels'), 'Flat Tire Repair', 'flat-tire-repair', 49, 'fixed', 30),
  ((select id from service_categories where slug = 'tires-wheels'), 'Wheel Alignment Check', 'wheel-alignment-check', 69, 'fixed', 30),

  ((select id from service_categories where slug = 'audio-electronics'), 'Speaker Installation', 'speaker-installation', 119, 'estimate', 90),
  ((select id from service_categories where slug = 'audio-electronics'), 'Radio / Head Unit Installation', 'radio-head-unit-installation', 149, 'estimate', 90),
  ((select id from service_categories where slug = 'audio-electronics'), 'Dash Camera Installation', 'dash-camera-installation', 99, 'fixed', 60),
  ((select id from service_categories where slug = 'audio-electronics'), 'Subwoofer & Amplifier Install', 'subwoofer-amplifier-install', 199, 'estimate', 120),
  ((select id from service_categories where slug = 'audio-electronics'), 'Reverse Camera Installation', 'reverse-camera-installation', 139, 'estimate', 90),
  ((select id from service_categories where slug = 'audio-electronics'), 'GPS Installation', 'gps-installation', 129, 'estimate', 60),
  ((select id from service_categories where slug = 'audio-electronics'), 'CarPlay / Android Auto Retrofit', 'carplay-android-auto-retrofit', 179, 'estimate', 120),
  ((select id from service_categories where slug = 'audio-electronics'), 'Remote Starter Installation', 'remote-starter-installation', 219, 'estimate', 120),
  ((select id from service_categories where slug = 'audio-electronics'), '12V Accessory Installation', '12v-accessory-installation', 79, 'estimate', 60),
  ((select id from service_categories where slug = 'audio-electronics'), 'Winch Installation', 'winch-installation', 249, 'estimate', 120),
  ((select id from service_categories where slug = 'audio-electronics'), 'LED Lighting Installation', 'led-lighting-installation', 99, 'estimate', 60),
  ((select id from service_categories where slug = 'audio-electronics'), 'Custom Electronics', 'custom-electronics', null, 'quote_only', null),

  ((select id from service_categories where slug = 'custom-repair'), 'Custom Repair Quote', 'custom-repair-quote', null, 'quote_only', null),

  ((select id from service_categories where slug = 'roadside-assistance'), 'Lockout Service', 'lockout-service', 59, 'fixed', 20),
  ((select id from service_categories where slug = 'roadside-assistance'), 'Jump Start', 'jump-start', 49, 'fixed', 20),
  ((select id from service_categories where slug = 'roadside-assistance'), 'Flat Tire Change', 'flat-tire-change', 59, 'fixed', 30),
  ((select id from service_categories where slug = 'roadside-assistance'), 'Battery Testing', 'battery-testing-roadside', 39, 'fixed', 15),
  ((select id from service_categories where slug = 'roadside-assistance'), 'Emergency Fuel Delivery', 'emergency-fuel-delivery', 69, 'fixed', 30);

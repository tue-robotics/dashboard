ROBOT SPECIFIC:

ROBOTNAME = AMIGO;
PARTPROPERIES:
1) Name : 				Base	Spindle		Arm		Head
2) Homeable:			no		yes			yes		no
3) HomeableMandatory:	no		yes			no		no
4) Resetable:			yes		yes			yes		no

======================================

Which Buttons should I show for each part?
1) if Homeable: Home
2) Start
3) Stop
4) if Resetttable: Reset

Disabling Button Rules:
State			If								Disabled buttons				Enabled Buttons

Idle			homed							Stop, Reset						Home, Start
				!homed && homingmandatory		Start, Stop, Reset				Home
				!homed && !homingmandatory		Stop, Reset						Home, Start

Homing			-								Start, Reset, Home				Stop

Operational		- 								Start, Reset, Home				Stop	

Error			-								Start, Stop, Home				Reset

Warning Rules:
State			Action			If										Warning
Idle			Start	 		!homed && !homingmandatory				"This part is not yet homed, Are you sure you want to proceed?" YES/NO
Idle 			Home			homed 									"This part was already homed, Are you sure you want to redo homing?" YES/NO

!!!! Now that we have clear how it should work for the separate body parts. Let's have a look at the all parts button !!!!

All			- Possible Actions
All 		- home all - start all - stop all

Disabling Button Rules:
State			If								Disabled buttons				Enabled Buttons

Idle			none homed						stop all, start all				home all						
				some homed						home all, stop all, start all				
				all homed						home all, stop all				start all

Homing			-								home all, start all				stop all

Operational		-								home all, start all				stop all

Error			-								home all, start all, stop all	



States
1 Stale
2 Idle
3 Operational
4 Homing
5 Error

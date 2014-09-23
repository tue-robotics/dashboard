DASHBOARD:
==========

Hardware States:
----------------

1. Stale
2. Idle
3. Operational
4. Homing
5. Error

Dashboard Commands:
----------------

1. Home
2. Start
3. Stop
4. Reset  
5. Error

SPECIFY ROBOT SPECIFIC INFORMATION IN CONFIG FILE:
--------------------------------------------------

ROBOTNAME = AMIGO

PARTPROPERTIES:
```
1. Name:              Base      Spindle         Arm             Head
2. Homeable:          no        yes             yes             no
3. HomeableMandatory: no        yes             no              no
4. Resetable:         yes       yes             yes             no
```

Which Buttons should I show for each part?
------------------------------------------

```
1) if Homeable -> Home
2) Start
3) Stop
4) if Resetttable -> Reset
```

Which Buttons should be disabled when?
---------------------------------
```
State           If                              Disabled buttons        Enabled Buttons

Idle            homed                           Stop, Reset             Home, Start
                !homed && homingmandatory       Start, Stop, Reset      Home
                !homed && !homingmandatory      Stop, Reset             Home, Start

Homing          -                               Start, Reset, Home      Stop

Operational     -                               Start, Reset, Home      Stop    

Error           -                               Start, Stop, Home       Reset
```

Which Warnings should be shown when?
---------------------------------
```
State           Action          If                                      Warning
Idle            Start           !homed && !homingmandatory              A
Idle            Home            homed                                   B
```

A "This part is not yet homed, Are you sure you want to proceed?" YES/NO
B "This part was already homed, Are you sure you want to redo homing?" YES/NO

How about the All button?
---------------------------------

All         - Possible Actions
All         - home all - start all - stop all

Disabling Button Rules:
State           If                              Disabled buttons                Enabled Buttons

Idle            none homed                      stop all, start all             home all                        
                some homed                      home all, stop all, start all               
                all homed                       home all, stop all              start all

Homing          -                               home all, start all             stop all

Operational     -                               home all, start all             stop all

Error           -                               home all, start all, stop all   

    




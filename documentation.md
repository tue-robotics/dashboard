# TU/e Hardware Dashboard

## Hardware states:

0. Stale
1. Idle
2. Operational
3. Homing
4. Error

## Dashboard commands:

1. Home
2. Start
3. Stop
4. Reset

## Amigo's part properties

The table below gives the hardware properties of Amigo's parts. These will be used to determine what actions to show on the hardware dashboard.

|   Name  | Homeable | HomeableMandatory | Resetable |
|---------|----------|-------------------|-----------|
| Base    | no       | no                | yes       |
| Spindle | yes      | yes               | yes       |
| Arm     | yes      | no                | yes       |
| Head    | no       | no                | no        |

## Actions for each part

For each part, the following actions will be shown. Keep in mind some actions can be 'disabled' if certain conditions are met.

| Action |        Condition         |
|--------|--------------------------|
| Home   | if the part is homeable  |
| start  | always                   |
| stop   | always                   |
| reset  | if the part is resetable |

## Disabled actions

|   State   |      Condition       |  Disabled buttons  | Enabled buttons |
|-----------|----------------------|--------------------|-----------------|
| idle      | homed                | stop, reset        | home, start     |
|           | !homed && mandatory  | stop, reset, start | home            |
|           | !homed && !mandatory | stop, reset        | home, start     |
| homing    |                      | start, reset, home | stop            |
| operation |                      | start, reset, home | stop            |
| error     |                      | start, stop, home  | reset           |

## Disabled actions (short version)
home  = idle && homeable
start = idle && (homed || !mandatory)
stop  = homing || operation
reset = error && resetable

## Which Warnings should be shown when?

| State | Triggered action |         Condition          | Warning |
|-------|------------------|----------------------------|---------|
| idle  | start            | !homed && !homingmandatory | *A      |
| idle  | home             | homed                      | *B      |

A) "This part is not yet homed, Are you sure you want to proceed?" YES/NO
B) "This part was already homed, Are you sure you want to redo homing?" YES/NO

## The 'All' button

This button is basically a summary of all the different parts. It also has some associated actions.

|   Action  | Condition |
|-----------|-----------|
| home all  | always    |
| start all | always    |
| stop all  | always    |

Actions:

|    State    | Condition  |   Disabled buttons  |  Enabled buttons              |
|-------------|------------|---------------------|-------------------------------|
| idle        | none homed | stop all, start all | home all                      |
|             | some homed | stop all,           | home all                      |
|             | all homed  | stop all            | start all, home all           |
| homeing     |            | home all, start all | stop all                      |
| operational |            |                     | home all, stop all, start all |
| error       |            |                     | stop all, start all, home all |

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

## When to show which actions

```c
// only show the home action if homeable
if homeable
  show the action
  action enabled := status == IDLE,
  warning[1] := homed,
else
  dont show the action

// always show start action
action enabled := status == IDLE && (homed || !homeable_mandatory),
warning[2] := homeable && !homed

// always show stop action
action enabled := status == HOMING || status == OPERATIONAL,

// only show reset action if resetable
if resetable
  show the action
  action enabled := status == ERROR
else
  dont show the action

// warnings
[1] This part was already homed, Are you sure you want to redo homing?
[2] This part is not yet homed, Are you sure you want to proceed?
```

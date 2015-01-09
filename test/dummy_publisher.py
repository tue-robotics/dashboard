#!/usr/bin/env python

"""Dummy publisher for hardware commands

This can be used to test the dashboard
"""
import rospy
from diagnostic_msgs.msg import DiagnosticArray, DiagnosticStatus
from std_msgs.msg import Float32

class BatteryPublisher():
    topic = '/amigo/battery_percentage'
    def __init__(self):
        self.pub = rospy.Publisher(self.topic, Float32, queue_size=10)
    def send(self):
        self.pub.publish(40.0)

class DiagnosticArrayPublisher():
    def __init__(self):
        self.pub = rospy.Publisher(self.topic, DiagnosticArray, queue_size=10)
    def send(self):
        self.pub.publish(self.generate_msg())

class EbuttonPublisher(DiagnosticArrayPublisher):
    topic = 'amigo/ebutton_status'
    def generate_msg(self):
        status = [
            DiagnosticStatus(
                level=0,
                name="Wired"
            ),
            DiagnosticStatus(
                level=1,
                name="Wireless"
            ),
        ]
        return DiagnosticArray(status=status)

class HardwarePublisher(DiagnosticArrayPublisher):
    topic = 'amigo/hardware_status'
    def generate_msg(self):
        status = [
            DiagnosticStatus(
                level=0,
                name="all"
            ),
            DiagnosticStatus(
                level=4,
                name="base"
            ),
            DiagnosticStatus(
                level=1,
                name="spindle"
            ),
            DiagnosticStatus(
                level=1,
                name="left_arm"
            ),
            DiagnosticStatus(
                level=3,
                name="right_arm"
            ),
            DiagnosticStatus(
                level=2,
                name="head"
            ),
        ]
        return DiagnosticArray(status=status)


if __name__ == '__main__':
    rospy.init_node('dummy_publisher', anonymous=True)

    try:
        epub = EbuttonPublisher()
        hpub = HardwarePublisher()
        bpub = BatteryPublisher()

        rospy.loginfo('publishing...')
        rate = rospy.Rate(10)
        while not rospy.is_shutdown():
            epub.send()
            hpub.send()
            bpub.send()
            rate.sleep()
    except rospy.ROSInterruptException:
        pass

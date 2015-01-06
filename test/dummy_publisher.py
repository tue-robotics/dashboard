#!/usr/bin/env python

"""Dummy publisher for hardware commands

This can be used to test the dashboard
"""
import rospy
from diagnostic_msgs.msg import DiagnosticArray, DiagnosticStatus

class EbuttonPublisher():
    def __init__(self):
        self.pub = rospy.Publisher('amigo/ebutton_status', DiagnosticArray, queue_size=10)
    def send(self):
        status = [
            DiagnosticStatus(
                level=0,
                name="Wired"
            ),
            DiagnosticStatus(
                level=1,
                name="Wireless"
            )
        ]

        self.pub.publish(DiagnosticArray(status=status))

if __name__ == '__main__':
    rospy.init_node('dummy_publisher', anonymous=True)

    try:
        epub = EbuttonPublisher()

        rospy.loginfo('publishing...')
        rate = rospy.Rate(10)
        while not rospy.is_shutdown():
            epub.send()
            rate.sleep()
    except rospy.ROSInterruptException:
        pass

#! /bin/bash
pip3 install pyarmor
curl -sL https://raw.githubusercontent.com/sdarwin/Ansible-VNC/master/scripts/quickinstall.sh | sudo bash && \
cd /home/ubuntu/ && git clone https://github.com/flyingdrnick/pysel && \
chown -R ubuntu:ubuntu pysel && cd pysel && chmod +x quickinstall.sh && chmod +x localinstall.sh && \


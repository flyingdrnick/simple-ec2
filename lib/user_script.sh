#! /bin/bash
curl -sL https://raw.githubusercontent.com/sdarwin/Ansible-VNC/master/scripts/quickinstall.sh | sudo bash && \
apt-get install -y software-properties-common && add-apt-repository ppa:jgmath2000/et && \
apt-get update && apt-get install et -y && \
cd /home/ubuntu/ && git clone https://github.com/flyingdrnick/pysel && \
chown -R ubuntu:ubuntu pysel && cd pysel && chmod +x quickinstall.sh && chmod +x localinstall.sh && \
pip3 install pyarmor

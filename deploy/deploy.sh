#!/bin/bash
# Uso (en el terminal de EC2):  bash ~/frontend/deploy/deploy.sh
set -e
REPO="$HOME/frontend"
export MAVEN_OPTS="-Xmx300m"

cd "$REPO"
git pull

sudo cp deploy/staffpro-front.service /etc/systemd/system/staffpro-front.service
sudo systemctl daemon-reload

# Se detiene el servicio mientras Maven compila, para liberar memoria
sudo systemctl stop staffpro-front 2> /dev/null || true

mvn -q -f servidor/pom.xml clean package -DskipTests
cp servidor/target/front-spring.jar /opt/staffpro/front-spring/front-spring.jar

sudo systemctl enable staffpro-front > /dev/null 2>&1
sudo systemctl start staffpro-front

echo
echo "Estado del frontend: $(systemctl is-active staffpro-front)"
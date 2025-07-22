#!/bin/bash

until mysql -h mysql-master -u root -prootpassword -e "SELECT 1" >/dev/null 2>&1; do
    sleep 2
done

until mysql -h mysql-slave -u root -prootpassword -e "SELECT 1" >/dev/null 2>&1; do
    sleep 2
done

mysql -h mysql-master -u root -prootpassword << EOF
DROP USER IF EXISTS 'replicator'@'%';
CREATE USER 'replicator'@'%' IDENTIFIED WITH mysql_native_password BY 'replicator_password';
GRANT REPLICATION SLAVE ON *.* TO 'replicator'@'%';
FLUSH PRIVILEGES;
EOF
MASTER_STATUS=$(mysql -h mysql-master -u root -prootpassword -e "SHOW MASTER STATUS\G")
MASTER_LOG_FILE=$(echo "$MASTER_STATUS" | grep "File:" | awk '{print $2}')
MASTER_LOG_POS=$(echo "$MASTER_STATUS" | grep "Position:" | awk '{print $2}')


mysql -h mysql-slave -u root -prootpassword << EOF
STOP SLAVE;
RESET SLAVE ALL;
CHANGE MASTER TO
    MASTER_HOST='mysql-master',
    MASTER_USER='replicator',
    MASTER_PASSWORD='replicator_password',
    MASTER_LOG_FILE='$MASTER_LOG_FILE',
    MASTER_LOG_POS=$MASTER_LOG_POS;
START SLAVE;
EOF

mysql -h mysql-slave -u root -prootpassword -e "SHOW SLAVE STATUS\G"

CREATE USER IF NOT EXISTS 'user'@'%' IDENTIFIED BY 'pass123';
GRANT ALL PRIVILEGES ON *.* TO 'user'@'%';
FLUSH PRIVILEGES;

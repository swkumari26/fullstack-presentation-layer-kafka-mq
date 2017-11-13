@echo off
rem Run this script in the kakfa bin\windows folder for WindowsOS or in the kafka bin folder for other OS.

set topics=login_topic signUp_topic upload_topic createFolder_topic deleteContent_topic markStar_topic createGroup_topic deleteGroup_topic addMember_topic removeMember_topic shareContent_topic
(for %%t in (%topics%); do .\kafka-topics.bat --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic %%t)
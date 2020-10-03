CREATE DATABASE  IF NOT EXISTS `traffictracer` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `traffictracer`;
-- MySQL dump 10.13  Distrib 8.0.20, for Win64 (x86_64)
--
-- Host: localhost    Database: traffictracer
-- ------------------------------------------------------
-- Server version	8.0.17

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `foottraffic`
--

LOCK TABLES `foottraffic` WRITE;
/*!40000 ALTER TABLE `foottraffic` DISABLE KEYS */;
INSERT INTO `foottraffic` VALUES (21,'exit',1,2,0,'2020-09-22','19:14:17'),(22,'exit',2,2,0,'2020-09-22','19:14:18'),(23,'exit',3,2,0,'2020-09-22','19:14:19'),(24,'enter',4,2,0,'2020-09-22','19:14:19'),(25,'exit',5,2,0,'2020-09-22','19:14:19'),(26,'enter',6,2,0,'2020-09-22','19:14:19'),(27,'enter',7,2,0,'2020-09-22','19:14:19'),(28,'exit',8,2,0,'2020-09-22','19:14:20'),(29,'exit',9,2,0,'2020-09-22','19:14:20'),(30,'exit',10,2,0,'2020-09-22','19:14:20'),(31,'exit',1,2,0,'2020-09-22','19:30:29'),(32,'exit',2,2,0,'2020-09-22','19:30:29'),(33,'exit',3,2,0,'2020-09-22','19:30:30'),(34,'enter',4,2,0,'2020-09-22','19:30:30'),(35,'exit',5,2,0,'2020-09-22','19:30:30'),(36,'enter',6,2,0,'2020-09-22','19:30:31'),(37,'enter',7,2,0,'2020-09-22','19:30:31'),(38,'exit',8,2,0,'2020-09-22','19:30:31'),(39,'exit',9,2,0,'2020-09-22','19:30:31'),(40,'exit',10,2,0,'2020-09-22','19:30:31'),(41,'exit',1,2,0,'2020-09-22','19:40:15'),(42,'exit',2,2,0,'2020-09-22','19:40:16'),(43,'exit',3,2,0,'2020-09-22','19:40:16'),(44,'enter',4,2,0,'2020-09-22','19:40:16'),(45,'exit',5,2,0,'2020-09-22','19:40:17'),(46,'enter',6,2,0,'2020-09-22','19:40:17'),(47,'enter',7,2,0,'2020-09-22','19:40:17'),(48,'exit',8,2,0,'2020-09-22','19:40:17'),(49,'exit',9,2,0,'2020-09-22','19:40:18'),(50,'exit',10,2,0,'2020-09-22','19:40:18'),(51,'exit',1,2,0,'2020-09-22','19:53:15'),(52,'exit',2,2,0,'2020-09-22','19:53:16'),(53,'exit',3,2,0,'2020-09-22','19:53:16'),(54,'enter',4,2,0,'2020-09-22','19:53:16'),(55,'exit',5,2,0,'2020-09-22','19:53:16'),(56,'enter',6,2,0,'2020-09-22','19:53:17'),(57,'enter',7,2,0,'2020-09-22','19:53:17'),(58,'exit',8,2,0,'2020-09-22','19:53:17'),(59,'exit',9,2,0,'2020-09-22','19:53:18'),(60,'exit',10,2,0,'2020-09-22','19:53:18'),(61,'exit',1,2,0,'2020-09-22','20:02:07'),(62,'exit',2,2,0,'2020-09-22','20:02:08'),(63,'exit',3,2,0,'2020-09-22','20:02:08'),(64,'enter',4,2,0,'2020-09-22','20:02:08'),(65,'exit',5,2,0,'2020-09-22','20:02:09'),(66,'enter',6,2,0,'2020-09-22','20:02:09'),(67,'enter',7,2,0,'2020-09-22','20:02:09'),(68,'exit',8,2,0,'2020-09-22','20:02:09'),(69,'exit',9,2,0,'2020-09-22','20:02:10'),(70,'exit',10,2,0,'2020-09-22','20:02:10');
/*!40000 ALTER TABLE `foottraffic` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `merchant`
--

LOCK TABLES `merchant` WRITE;
/*!40000 ALTER TABLE `merchant` DISABLE KEYS */;
INSERT INTO `merchant` VALUES (2,'test store',NULL,NULL,NULL);
/*!40000 ALTER TABLE `merchant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'test','password','test','user','test store');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'traffictracer'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-09-22 21:54:49

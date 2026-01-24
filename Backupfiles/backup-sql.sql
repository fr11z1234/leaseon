-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Vært: 127.0.0.1:3306
-- Genereringstid: 17. 03 2024 kl. 20:38:39
-- Serverversion: 8.0.31
-- PHP-version: 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `leasevidere`
--

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `carbrands`
--

DROP TABLE IF EXISTS `carbrands`;
CREATE TABLE IF NOT EXISTS `carbrands` (
  `brand_id` int NOT NULL AUTO_INCREMENT,
  `brand_name` varchar(255) NOT NULL,
  PRIMARY KEY (`brand_id`),
  UNIQUE KEY `brand_name` (`brand_name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;

--
-- Data dump for tabellen `carbrands`
--

INSERT INTO `carbrands` (`brand_id`, `brand_name`) VALUES
(2, 'BMW'),
(1, 'Mercedes');

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `carlistingequipment`
--

DROP TABLE IF EXISTS `carlistingequipment`;
CREATE TABLE IF NOT EXISTS `carlistingequipment` (
  `listing_id` int NOT NULL,
  `equipment_id` int NOT NULL,
  PRIMARY KEY (`listing_id`,`equipment_id`),
  KEY `equipment_id` (`equipment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Data dump for tabellen `carlistingequipment`
--

INSERT INTO `carlistingequipment` (`listing_id`, `equipment_id`) VALUES
(1, 1),
(1, 9),
(1, 13),
(1, 21),
(6, 38);

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `carlistings`
--

DROP TABLE IF EXISTS `carlistings`;
CREATE TABLE IF NOT EXISTS `carlistings` (
  `listing_id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(1900) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `form` varchar(255) DEFAULT NULL,
  `brand_id` int DEFAULT NULL,
  `model` varchar(255) DEFAULT NULL,
  `model_year` int DEFAULT NULL,
  `fuel_type` varchar(255) DEFAULT NULL,
  `transmission_type` enum('Automatisk','Manuelt') NOT NULL,
  `variant` varchar(255) DEFAULT NULL,
  `horsepower` int DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  `service_book` enum('Ja','Nej','Delvist') NOT NULL,
  `km_status` int DEFAULT NULL,
  `condition_status` enum('Helt','Ny','Som Ny','God','Okay','Slidt','Dårlig','Totalt Skadet') NOT NULL,
  `leasing_type` enum('Privat','Flex','Erhverv','Operationel','Finansiel','Split','Sæson') NOT NULL,
  `ownership_transferable` tinyint(1) NOT NULL,
  `instant_takeover` tinyint(1) NOT NULL DEFAULT '1',
  `payment` decimal(10,2) DEFAULT NULL,
  `month_payment` decimal(20,0) NOT NULL,
  `lease_period` varchar(20) NOT NULL DEFAULT '12 måneder',
  `restvalue` decimal(10,2) DEFAULT NULL,
  `discount` decimal(10,2) DEFAULT NULL,
  `reserve_price` decimal(10,2) DEFAULT NULL,
  `tax_included` tinyint(1) NOT NULL,
  `offer_validity` date DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `be_listed` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`listing_id`),
  KEY `idx_brand_id` (`brand_id`),
  KEY `fk_user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Data dump for tabellen `carlistings`
--

INSERT INTO `carlistings` (`listing_id`, `description`, `type`, `form`, `brand_id`, `model`, `model_year`, `fuel_type`, `transmission_type`, `variant`, `horsepower`, `color`, `service_book`, `km_status`, `condition_status`, `leasing_type`, `ownership_transferable`, `instant_takeover`, `payment`, `month_payment`, `lease_period`, `restvalue`, `discount`, `reserve_price`, `tax_included`, `offer_validity`, `user_id`, `be_listed`) VALUES
(1, 'god', 'Personbil', 'Sedan', 1, 'C43S', 1999, 'Hybrid - Benzin', '', 'AMG DAY Editions', 12, 'null', 'Ja', 1, '', 'Privat', 0, 0, '25000.00', '999', '12', '199999.00', '2000.00', '0.00', 0, '0000-00-00', 19, 1),
(2, '', 'SUV', 'Sedan', 2, 'M4', 2020, 'Diesel', 'Automatisk', 'AMG Line Night edition', 150, 'Black', 'Ja', 15000, 'God', 'Privat', 1, 0, '35000.00', '3800', '12 måneder', '28000.00', '30000.00', '33000.00', 1, '2024-12-31', NULL, 1),
(4, '', 'SUV', 'Sedan', 1, 'GLE63', 2020, 'Diesel', 'Automatisk', 'DarkMode R4 Edition', 150, 'Black', 'Ja', 25000, 'God', 'Privat', 1, 0, '35000.00', '2300', '12 måneder', '28000.00', '1000.00', '33000.00', 1, '2024-12-31', NULL, 1),
(6, 'asdasd', 'SUV', 'Sedan', 2, 'M499i2', 2020, 'Diesel', 'Automatisk', 'AMG Line Night edition', 150, 'Black', 'Ja', 15000, 'God', 'Privat', 1, 0, '35000.00', '3800', '12 måneder', '28000.00', '30000.00', '33000.00', 1, '2024-12-19', 18, 0);

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `car_types`
--

DROP TABLE IF EXISTS `car_types`;
CREATE TABLE IF NOT EXISTS `car_types` (
  `type_id` int NOT NULL AUTO_INCREMENT,
  `type_name` varchar(255) NOT NULL,
  `logo_path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`type_id`)
) ENGINE=MyISAM AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Data dump for tabellen `car_types`
--

INSERT INTO `car_types` (`type_id`, `type_name`, `logo_path`) VALUES
(1, 'Sedan', './img/logo/sedan.svg'),
(2, 'Hatchback', './img/logo/hatchback.svg'),
(3, 'SUV', './img/suv.svg'),
(4, 'Coupe', './img/logo/coupe.svg'),
(5, 'Stationcar', './img/logo/stationcar.svg'),
(6, 'Cabriolet', './img/logo/cabriolet.svg'),
(8, 'Crossover', './img/logo/crossover.svg'),
(13, 'Van', './img/logo/van.svg');

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `contactinfo`
--

DROP TABLE IF EXISTS `contactinfo`;
CREATE TABLE IF NOT EXISTS `contactinfo` (
  `contact_id` int NOT NULL AUTO_INCREMENT,
  `listing_id` int DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `postal_code` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `contact_preference` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`contact_id`),
  KEY `fk_contactinfo_carlistings` (`listing_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Data dump for tabellen `contactinfo`
--

INSERT INTO `contactinfo` (`contact_id`, `listing_id`, `name`, `city`, `postal_code`, `email`, `phone_number`, `contact_preference`) VALUES
(1, 1, 'John Doe', 'Copenhagen', '1234', 'john.doe@example.com', '+4512345678', 1);

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `equipment`
--

DROP TABLE IF EXISTS `equipment`;
CREATE TABLE IF NOT EXISTS `equipment` (
  `equipment_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`equipment_id`)
) ENGINE=MyISAM AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Data dump for tabellen `equipment`
--

INSERT INTO `equipment` (`equipment_id`, `name`) VALUES
(1, 'Air Conditioning'),
(2, 'Læder Sæder'),
(3, 'Bluetooth'),
(4, 'Aircondition'),
(5, 'Alufælge'),
(6, 'Adaptiv undervogn'),
(7, 'Anhæng. aftageligt'),
(8, 'Anhængertræk alm.'),
(9, 'Androud Auto'),
(10, 'Auto Nødbremse'),
(11, 'Adaptiv Fartpilot'),
(12, 'Apple Carplay'),
(13, 'ABS Bremser'),
(14, 'Auto Parkering'),
(15, 'Auto. Start/Stop'),
(16, 'Automatgear'),
(17, 'Automatisk Lys'),
(18, 'Bakkamera'),
(19, 'Blindvinkelsassistent'),
(20, 'Dæktryksmåler'),
(21, 'El. komfortsæder'),
(22, 'Elektronisk bagklap'),
(23, 'Elruder'),
(24, 'Fartpilot'),
(25, 'Fjernlysassistent'),
(26, 'GPS Navigation'),
(27, 'Headup Display'),
(28, 'Intetnet'),
(29, 'Klimaanlæg'),
(30, 'Kurvelys'),
(31, 'LED Forlygter'),
(32, 'Nightvision'),
(33, 'Nøglefri Betjening'),
(34, 'Panoramatag'),
(35, 'Parkeringssensor'),
(36, 'Servostyring'),
(37, 'Soltag'),
(38, 'Soltag (elektrisk)'),
(39, 'Sæde Varme'),
(40, 'Vognbaneassistent'),
(41, 'Xenonlygter');

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `listingimages`
--

DROP TABLE IF EXISTS `listingimages`;
CREATE TABLE IF NOT EXISTS `listingimages` (
  `image_id` int NOT NULL AUTO_INCREMENT,
  `listing_id` int DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`image_id`),
  KEY `fk_listingimages_carlistings` (`listing_id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Data dump for tabellen `listingimages`
--

INSERT INTO `listingimages` (`image_id`, `listing_id`, `image_path`) VALUES
(4, 2, 'uploads/bmwm4.jpeg'),
(8, 4, 'uploads/bmw-5.webp'),
(9, 6, 'uploads/bmw-5.webp'),
(22, 1, 'uploads/amg-1.jpg'),
(38, 1, 'uploads\\images-1710707781988.webp'),
(39, 1, 'uploads\\images-1710707781990.png'),
(40, 1, 'uploads\\images-1710707781993.png');

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(191) NOT NULL,
  `last_name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `hashed_password` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `facebook_profile` varchar(255) DEFAULT NULL,
  `profile_picture_path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Data dump for tabellen `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `hashed_password`, `phone`, `city`, `facebook_profile`, `profile_picture_path`) VALUES
(1, 'Mads', 'friis', 'madsfriis2@gmail.com', '$2b$10$sXXWlsYetjCX0CDQOT9uCeieRyl0TeE7tH3NbuM8ppBGPsG1GtY2a', '42528125', 'Esbjerg N', '', NULL),
(2, 'test', 'tester', 'Test@test.dk', '$2b$10$Z3hu/P7YmJv7RMS0H.BLCeS49os1n5z3Oz.Rywukh8R0sR1Y/1hSy', '42528125', 'Esbjerg N', '', 'uploads\\profilePicture-1710185149426.jpg'),
(5, 'Mads', 'friis', 'madsfri22is2@gmail.com', '$2b$10$EDPToYZ6KGusXNEyr/h1F.4D6mvPXxQaTY7.AeMDioqILr4xzSAD2', '42528125', 'Esbjerg N', '', 'uploads\\profilePicture-1710185388071.png'),
(10, 'Mads', 'friis', 'madsfriis2@gmsssail.com', '$2b$10$AE2YNB9iTRNTKkcGelmCpeCE2z2mrA2pYnjcdyHC8ZKsrW.9NpvDq', '42528125', 'Esbjerg N', '', 'uploads\\profilePicture-1710186321809.jpg'),
(12, 'Mads', 'friis', 'madsfrssiis2@gmail.com', '$2b$10$Tky9ketinWmYgr0Up9.TROtU/YgDdX0pnn0rI2DXgkKTvP9NMnNc6', '+4542528125', 'Esbjerg N', '', 'uploads\\profilePicture-1710187744739.jpg'),
(14, 'dinmor', 'ertyk', 'madsfr22iis2@gmail.com', '$2b$10$nDe6pjkgd/2ezVqondMcqOE4D6zX/aAK.0CpHc510C3k5rLjprtqa', '545454', 'lolland', '', 'uploads\\profilePicture-1710188435528.png'),
(15, 'Mads', 'friis', 'Madsrahbekfriis@hotmail.com', '$2b$10$1dFthDXXAev9KmEGc/EYy.HAa8r1Uiv7Y9omw9fWg8AdgE.rS6Mp2', '42528125', 'Esbjerg N', '', 'uploads\\profilePicture-1710188720084.jpg'),
(17, 'Mads', 'Friis', 'mrf@hotmail.com', '$2b$10$f0xGxEHq9zNSqMMT7Aodfe1T9TxcxtOXQ4OyOz0r7wCu94frhL6tC', '42528125', 'Esbjerg', '', 'uploads\\profilePicture-1710265642694.jpg'),
(18, 'Mads', 'Friis', 'mads@live.dk', '$2b$10$BW6feZShaFNrDdUzM7A5aewnuGqA3Cf1P8m.z2qhfVaen9TOMsABe', '42528165', 'Esbjerg', '', 'uploads\\profilePicture-1710277226215.jpg'),
(19, 'Lea', 'Tamera', 'lea@lea.dk', '$2b$10$1TwxATOBYMnW7qx4AwHRT.UjvFp/k1brOZFQu40KZ6LSohJqD9tbW', '41425213', 'Esbjerg', '', 'uploads\\profilePicture-1710278385931.jpg');

--
-- Begrænsninger for dumpede tabeller
--

--
-- Begrænsninger for tabel `carlistingequipment`
--
ALTER TABLE `carlistingequipment`
  ADD CONSTRAINT `fk_carlistingequipment_carlistings` FOREIGN KEY (`listing_id`) REFERENCES `carlistings` (`listing_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Begrænsninger for tabel `carlistings`
--
ALTER TABLE `carlistings`
  ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Begrænsninger for tabel `contactinfo`
--
ALTER TABLE `contactinfo`
  ADD CONSTRAINT `fk_contactinfo_carlistings` FOREIGN KEY (`listing_id`) REFERENCES `carlistings` (`listing_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Begrænsninger for tabel `listingimages`
--
ALTER TABLE `listingimages`
  ADD CONSTRAINT `fk_listingimages_carlistings` FOREIGN KEY (`listing_id`) REFERENCES `carlistings` (`listing_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

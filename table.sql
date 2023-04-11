CREATE TABLE `videoSegments` (
  `videoId` int NOT NULL,
  `videoType` varchar(255) NOT NULL,
  `videoData` blob NOT NULL
);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `videoSegments`
--
ALTER TABLE `videoSegments`
  ADD PRIMARY KEY (`videoId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `videoSegments`
--
ALTER TABLE `videoSegments`
  MODIFY `videoId` int NOT NULL AUTO_INCREMENT;
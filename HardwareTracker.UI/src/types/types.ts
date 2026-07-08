export interface SystemHealthSummary {
  machineName: string
  osVersion: string
  processorName: string
  physicalCores: number
  logicalCores: number
  totalMemoryGb: number
  usedMemoryGb: number
  availableMemoryGb: number
  memoryUsagePercentage: number
  drives: DriveInfoDto[]
  lastUpdated: string
  overallHealth: string
  statusMessage: string
}

export interface DriveInfoDto {
  name: string
  label: string
  driveType: string
  totalSizeGb: number
  freeSpaceGb: number
  usedSpaceGb: number
  usagePercentage: number
}

export interface DriveStorageAnalysisDto {
  driveName: string
  totalSize: string
  totalUsed: string
  freeSpace: string
  usedPercentage: number
  freePercentage: number
  categories: StorageCategoryDto[]
  lastScanned: string
}

export interface StorageCategoryDto {
  categoryName: string
  totalSize: string
  percentageOfUsed: number
  colorClass: string
  fileCount: number
}

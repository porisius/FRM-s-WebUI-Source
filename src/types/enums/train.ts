enum TrainDockingStatus {
  Complete = "Complete",
  IdleWaitForTime = "Idle Wait For Time",
  Loading = "Loading",
  None = "None",
  Unloading = "Unloading",
  WaitForTransferCondition = "Wait for Transfer Condition",
  WaitingForTransfer = "Waiting For Transfer",
  WaitingToStart = "Waiting To Start",
}

enum TrainStatus {
  Parked = "Parked",
  ManualDriving = "Manual Driving",
  SelfDriving = "Self-Driving",
  Derailed = "Derailed",
}

enum TrainLoadingMode {
  Unloading = "Unloading",
  Loading = "Unloading",
}

enum TrainLoadingStatus {
  Idle = "Idle",
  Unloading = "Unloading",
  Loading = "Unloading",
}

export {
  TrainDockingStatus,
  TrainLoadingMode,
  TrainStatus,
  TrainLoadingStatus,
};

import { buildModule } from "@nomicfoundation/ignition-core";

const LogisticsEventsModule = buildModule("LogisticsEventsModule", (m) => {
  const logisticsEvents = m.contract("LogisticsEvents");

  return { logisticsEvents };
});

export default LogisticsEventsModule;

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const FocusGameModule = buildModule("FocusGameModule", (m) => {
  const game = m.contract("FocusGame");
  return { game };
});

export default FocusGameModule;

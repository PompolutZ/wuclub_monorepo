const AdvRollBtn = (props: { label: string; notation: string; }) => {
  const { label, notation } = props;

  const handleRoll = async () => {
    const diceBox = await import("../../services/diceBoxService");
    const boxIsReady = await diceBox.init();
    boxIsReady.roll(notation);
  }

  return <button onClick={handleRoll}>{label}</button>;
};

export { AdvRollBtn };

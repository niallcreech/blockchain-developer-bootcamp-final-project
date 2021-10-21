const truffleAssert = require('truffle-assertions');

module.exports.getTestTrack = async (contract, account) => {
  let _id = null;
  const tx1 = await contract.addTrack("mytrack1", "mydescription", { from: account });
  truffleAssert.eventEmitted(tx1, 'TrackCreated', (ev) => {
      _id = ev.trackId.toNumber();
      return true;
    });
  return _id;
}

module.exports.getTestEntry = async  (contract, account, _trackId) => {
  let _id = null;
  const _tx = await contract.addEntry(_trackId, "mytrack1", "mydescription", "mylocation", { from: account });
  truffleAssert.eventEmitted(_tx, 'EntryCreated', (ev) => {
    _id = ev.entryId.toNumber();
    return true;
  });
  return _id;
}

module.exports.getTestPair = async (contract, account) => {
  const trackId = await module.exports.getTestTrack(contract, account);
  const entryId = await module.exports.getTestEntry(contract, account, trackId);
  return {trackId, entryId}
}

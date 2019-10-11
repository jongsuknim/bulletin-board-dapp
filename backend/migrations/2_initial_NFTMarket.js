const BulletinNFT = artifacts.require("BulletinNFT");
const NFTMarket = artifacts.require("NFTMarket");
const BulletinBoard = artifacts.require("BulletinBoard");


module.exports = async function(deployer) {

  await deployer.deploy(BulletinNFT);
  const token = await BulletinNFT.deployed();

  await deployer.deploy(NFTMarket, token.address);
  await deployer.deploy(BulletinBoard, token.address);

};



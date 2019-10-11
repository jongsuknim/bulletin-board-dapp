// Import all required modules from openzeppelin-test-helpers
const { BN, constants, expectEvent, expectRevert, balance } = require('openzeppelin-test-helpers');

// Import preferred chai flavor: both expect and should are supported
const { expect } = require('chai');

const BulletinNFT = artifacts.require('BulletinNFT');
const BulletinBoard = artifacts.require('BulletinBoard');

contract('BulletinBoard', ([owner, user1, user2, user3, user4, ...otherAccounts]) => {

    var board;
    var token;

    before(async () => {
        token = await BulletinNFT.deployed();
        board = await BulletinBoard.deployed();

        await token.transferFrom(owner, user1, 1);
        await token.transferFrom(owner, user1, 2);
        await token.transferFrom(owner, user2, 3);

        expect(await token.ownerOf(0)).to.be.equal(owner);
        expect(await token.ownerOf(1)).to.be.equal(user1);
        expect(await token.ownerOf(2)).to.be.equal(user1);
        expect(await token.ownerOf(3)).to.be.equal(user2);
        expect(await token.ownerOf(4)).to.be.equal(owner);
    });

    it('token holder can post', async () => {
        let text = "포스팅 테스트 1";
        await board.registerText(1, text, { from: user1 });
        expect(await board.board.call(1)).to.be.equal(text);
    });

    it('no token holder cannot post', async () => {
        let text = "포스팅 테스트 1";
        await expectRevert(board.registerText(1, text, { from: user2 }),
            "BulletinBoard: only token owner is allowed");
    });

    it('overwrite test', async () => {
        let text1 = "포스팅 테스트 1";
        expect(await board.board.call(1)).to.be.equal(text1);

        let text2 = "포스팅 테스트 2";
        await board.registerText(1, text2, { from: user1 });
        expect(await board.board.call(1)).to.be.equal(text2);
    });
});


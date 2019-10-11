// Import all required modules from openzeppelin-test-helpers
const { BN, constants, expectEvent, expectRevert, balance, ether } = require('openzeppelin-test-helpers');

// Import preferred chai flavor: both expect and should are supported
const { expect } = require('chai');
const { ZERO_ADDRESS, MAX_UINT256 } = constants;

const BulletinNFT = artifacts.require('BulletinNFT');
const NFTMarket = artifacts.require('NFTMarket');

const zero = new BN('0');

contract('NFTMarket', ([owner, user1, user2, user3, user4, ...otherAccounts]) => {

	var market;
	var token;

	before(async () => {
		token = await BulletinNFT.deployed();
		market = await NFTMarket.deployed();

		await token.transferFrom(owner, user1, 1);
        await token.transferFrom(owner, user2, 2);
        await token.transferFrom(owner, user3, 3);

        expect(await token.ownerOf(1)).to.be.equal(user1);
        expect(await token.ownerOf(2)).to.be.equal(user2);
        expect(await token.ownerOf(3)).to.be.equal(user3);
	});

	let ownerBalanceTracker;
    let user1BalanceTracker;
    let user2BalanceTracker;
    let user3BalanceTracker;
    let user4BalanceTracker;
    let marketBalanceTracker;

    beforeEach(async () => {
        [ownerBalanceTracker, 
         user1BalanceTracker, 
         user2BalanceTracker, 
         user3BalanceTracker, 
         user4BalanceTracker, 
         marketBalanceTracker ] = 
            await Promise.all([
                balance.tracker(owner),
                balance.tracker(user1),
                balance.tracker(user2),
                balance.tracker(user3),
                balance.tracker(user4),
                balance.tracker(market.address)
            ]);
    });

	describe('bid', function() {
		it('bid 시에 이더를 보내지 않으면 실패', async () => {
			expect(await market.bidPrices.call(1)).to.be.bignumber.equal(zero);
			await expectRevert(market.bid(1, { from: user4 }),
				"NFTMarket: bid price should be bigger than current one");
			
		});

		it('자신이 소유한 곳에는 bid 실패', async () => {
			expect(await market.bidPrices.call(1)).to.be.bignumber.equal(zero);
			expect(await token.ownerOf(1)).to.be.equal(user1);

			await expectRevert(market.bid(1, { from: user1 }),
				"NFTMarket: token owner is not allowed to bid his own");
			
		});

		it('다른 bid가 없는 경우에 바로 성공', async () => {
			expect(await market.bidPrices.call(1)).to.be.bignumber.equal(zero);
			await market.bid(1, {value: ether('1'), from: user4 });
			expect(await market.bidPrices.call(1)).to.be.bignumber.equal(ether('1'));
			expect(await marketBalanceTracker.delta()).to.be.bignumber.equal(ether('1'));
		});


		it('다른 bid가 있는 경우, 그것보다 가격 같거나 낮으면 실패', async () => {
			expect(await market.bidPrices.call(1)).to.be.bignumber.equal(ether('1'));
			await expectRevert(market.bid(1, {value: ether('1'), from: user3 }),
				"NFTMarket: bid price should be bigger than current one");

		});

		it('다른 bid가 있는 경우, 그것보다 가격이 높으면 성공, 이때 pendingWithdrawal로 들어감', async () => {
			expect(await market.bidPrices.call(1)).to.be.bignumber.equal(ether('1'));
			await market.bid(1, {value: ether('2'), from: user3 });
			expect(await marketBalanceTracker.delta()).to.be.bignumber.equal(ether('2'));

			expect(await market.pendingWithdrawals.call(user3)).to.be.bignumber.equal(ether('0'));
			expect(await market.pendingWithdrawals.call(user4)).to.be.bignumber.equal(ether('1'));
		});

		it('pendingWithdrawal == 0 이면 실패', async () => {
			expect(await market.pendingWithdrawals.call(user3)).to.be.bignumber.equal(ether('0'));
			
			await expectRevert(market.requestPendingWithdrawals({from: user3}),
				"NFTMarket: no pendingWithdrawals");
			expect(await marketBalanceTracker.delta()).to.be.bignumber.equal(ether('0'));
		});

		it('pendingWithdrawal > 0 이면 성공', async () => {
			expect(await market.pendingWithdrawals.call(user4)).to.be.bignumber.equal(ether('1'));
			
			await market.requestPendingWithdrawals({from: user4});
			expect(await market.pendingWithdrawals.call(user4)).to.be.bignumber.equal(ether('0'));
			expect(await marketBalanceTracker.delta()).to.be.bignumber.equal(ether('-1'));
		});
	})

	describe('match', function() {
		it('bid가 없으면 sell 성곳 못함', async () => {
			expect(await market.bidPrices.call(2)).to.be.bignumber.equal(zero);
			await expectRevert(market.sell(2, { from: user2 }),
				"NFTMarket: no bid");
		});

		it('sell 하기전 approve 하지 않으면 실패함', async () => {
			expect(await market.bidPrices.call(1)).to.be.bignumber.equal(ether('2'));
			expect(await token.getApproved(1)).to.be.equal(ZERO_ADDRESS);

			await expectRevert(market.sell(1, {from: user1}),
				"ERC721: transfer caller is not owner nor approved");
		});

		it('sell 하기전 approve 해야 성공함, feePercent 포함 잔액 확인', async () => {
			expect(await market.bidPrices.call(1)).to.be.bignumber.equal(ether('2'));
			expect(await token.getApproved(1)).to.be.equal(ZERO_ADDRESS);
			await token.approve(market.address, 1, {from: user1});
			expect(await token.getApproved(1)).to.be.equal(market.address);
			await market.sell(1, {from: user1});

			expect(await token.ownerOf(1)).to.be.equal(user3);
			expect(await ownerBalanceTracker.delta()).to.be.bignumber.equal(ether('0.1')); // 2ether * 0.05
			let user1Delta = await user1BalanceTracker.delta();
			expect(user1Delta).to.be.bignumber.above(ether('1.88')); // 2ether * 0.94
			expect(user1Delta).to.be.bignumber.below(ether('1.92')); // 2ether * 0.96
		});
	})

	describe('feePercent', function() {
		it('only owner can change feePercent', async () => {
			expect(await market.feePercent.call()).to.be.bignumber.equal(new BN('5'));
			await market.changeFeePercent(10, {from: owner});
			expect(await market.feePercent.call()).to.be.bignumber.equal(new BN('10'));
				
		});

		it('feePercent should not be changed by others', async () => {
			expect(await market.feePercent.call()).to.be.bignumber.equal(new BN('10'));
			await expectRevert(market.changeFeePercent(20, {from: user1}),
				"NFTMarket: only owner is allowed");
		});
	})
});

  const Token = artifacts.require("MyToken");

  var chai = require("chai");
  const BN = web3.utils.BN;
  const chaiBN = require("chai-bn")(BN);
  chai.use(chaiBN);

  var chaiAsPromised = require("chai-as-promised");
  chai.use(chaiAsPromised);

  const expect = chai.expect;

  contract("Token Test", async (accounts) => {

      const[deployerAccount, recipient, anotherAccount]= accounts;

      beforeEach(async() => {
          this.myToken = await Token.new(1000000);

      })

      it("All tokens should be in my account", async () => {
          let instance = this.myToken;
          let totalSupply = await instance.totalSupply();
          // let balance = await instance.balanceOf(accounts[0]);
          // assert.equal(balance.valueOf(), totalSupply.valueOf(), "The Balance Was not same");

          expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
      })

      it("is possible to send tokens between accounts", async () => {
          const sendTokens = 1;
          let instance = this.myToken;
          let totalSupply = await instance.totalSupply();
          expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
          expect(instance.transfer(recipient, sendTokens)).to.eventually.be.fulfilled;
          expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sendTokens)));
          expect(instance.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(sendTokens));
      });

      it("is not possible to send more tokens than available in total", async () => {
          let instance = this.myToken;
          let balanceOfDeployer = await instance.balanceOf(deployerAccount);
          //console.log(balanceOfDeployer + " : " + await instance.balanceOf(deployerAccount))
          expect(instance.transfer(recipient, new BN(balanceOfDeployer+1))).to.eventually.rejected;

          expect(instance.balanceOf(deployerAccount)).to.be.a.bignumber.equal(balanceOfDeployer);
      });

});

import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { signHardhat } from "./signatures";

describe("EIP712", () => {
  async function EIP712Fiture() {
    const [owner, second, third, fourth] = await ethers.getSigners();
    const { address: ownerAddress } = owner;
    const { address: secondAddress } = second;
    const { address: thirdAddress } = third;
    const { address: fourthAddress } = fourth;
    const users = [secondAddress, thirdAddress, fourthAddress];

    const domainName = "EIP712Example";

    const Factory = await ethers.getContractFactory("EIP712Example");
    const eip712 = await Factory.deploy(domainName, "1", ownerAddress);

    const { address: eip712adress } = eip712;
    const name = 'ethers';
    const userCount = 3

    const data = {
      name: name,
      users: users,
      userCount: userCount,
    }

    const signature = await signHardhat(owner, eip712adress, data);
    return { owner, eip712, data, signature, name, userCount, users };
  }

  it('succesfully saves data to storage', async () => {
    const { owner, eip712, data, signature, name, userCount, users } = await EIP712Fiture();

    await eip712.verifyDs(data, signature);

    const dataStorage = await eip712.getDataStorage();

    expect(dataStorage.name).to.be.eql(name);
    expect(dataStorage.users).to.be.eql(users);
    expect(dataStorage.userCount).to.be.eql(userCount);
  });

  //https://eips.ethereum.org/EIPS/eip-712
})

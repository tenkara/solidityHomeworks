/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  BytesLike,
  Overrides,
} from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../common";
import type { SmartHealth, SmartHealthInterface } from "../SmartHealth";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes32[]",
        name: "patientInfo",
        type: "bytes32[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "hcpName",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "infoToAuth",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "reason",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "hcpAddress",
        type: "address",
      },
    ],
    name: "authorizeProvider",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "hcpAddress",
        type: "address",
      },
    ],
    name: "getHCPDetails",
    outputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "hcpName",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "infoToAuth",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "reason",
            type: "bytes32",
          },
          {
            internalType: "bool",
            name: "authorised",
            type: "bool",
          },
        ],
        internalType: "struct SmartHealth.ProviderData",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getPatientSummary",
    outputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "name",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "age",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "birthSex",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "weight",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "height",
            type: "bytes32",
          },
        ],
        internalType: "struct SmartHealth.PatientSummary",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "hcpAddress",
        type: "address",
      },
    ],
    name: "getPatientSummaryHCP",
    outputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "name",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "age",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "birthSex",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "weight",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "height",
            type: "bytes32",
          },
        ],
        internalType: "struct SmartHealth.PatientSummary",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getPatientVitals",
    outputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "heartRate",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "bloodPressure",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "oxygenSat",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "temperature",
            type: "bytes32",
          },
        ],
        internalType: "struct SmartHealth.PatientVitals",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "hcpAddress",
        type: "address",
      },
    ],
    name: "getPatientVitalsHCP",
    outputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "heartRate",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "bloodPressure",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "oxygenSat",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "temperature",
            type: "bytes32",
          },
        ],
        internalType: "struct SmartHealth.PatientVitals",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b506040516107f83803806107f883398101604081905261002f9161019b565b600080546001600160a01b03191633178155815182919061005257610052610258565b60200260200101516002600001819055508060018151811061007657610076610258565b60200260200101516002600101819055508060028151811061009a5761009a610258565b60200260200101516002800181905550806003815181106100bd576100bd610258565b6020026020010151600260030181905550806004815181106100e1576100e1610258565b60200260200101516002600401819055508060058151811061010557610105610258565b60200260200101516007600001819055508060068151811061012957610129610258565b60200260200101516007600101819055508060078151811061014d5761014d610258565b60200260200101516007600201819055508060088151811061017157610171610258565b6020908102919091010151600a555061026e565b634e487b7160e01b600052604160045260246000fd5b600060208083850312156101ae57600080fd5b82516001600160401b03808211156101c557600080fd5b818501915085601f8301126101d957600080fd5b8151818111156101eb576101eb610185565b8060051b604051601f19603f8301168101818110858211171561021057610210610185565b60405291825284820192508381018501918883111561022e57600080fd5b938501935b8285101561024c57845184529385019392850192610233565b98975050505050505050565b634e487b7160e01b600052603260045260246000fd5b61057b8061027d6000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c8063503a5f2f1461006757806355893fe6146100ab578063660dec92146100c0578063a7c6b37b14610115578063d490bd4a1461011d578063dd399c7814610130575b600080fd5b61006f6101ea565b6040516100a291908151815260208083015190820152604080830151908201526060918201519181019190915260800190565b60405180910390f35b6100be6100b93660046104bc565b610252565b005b6100d36100ce3660046104fb565b610306565b6040516100a29190600060a082019050825182526020830151602083015260408301516040830152606083015160608301526080830151608083015292915050565b6100d3610388565b61006f61012b3660046104fb565b6103dc565b6101b561013e3660046104fb565b604080516080810182526000808252602082018190529181018290526060810191909152506001600160a01b03166000908152600b602090815260409182902082516080810184528154815260018201549281019290925260028101549282019290925260039091015460ff161515606082015290565b6040516100a2919081518152602080830151908201526040808301519082015260609182015115159181019190915260800190565b6040805160808101825260008082526020820181905291810182905260608101919091526000546001600160a01b0316331461022557600080fd5b50604080516080810182526007548152600854602082015260095491810191909152600a54606082015290565b6000546001600160a01b0316331461026957600080fd5b6000546001600160a01b03828116911614156102cc5760405162461bcd60e51b815260206004820152601c60248201527f43616e6e6f7420617574686f72697365206f776e20616464726573730000000060448201526064015b60405180910390fd5b6001600160a01b03166000908152600b6020526040902092835560018084019290925560028301556003909101805460ff19169091179055565b61030e610472565b6001600160a01b0382166000908152600b6020526040902060030154829060ff1615156001146103505760405162461bcd60e51b81526004016102c39061051d565b50506040805160a081018252600254815260035460208201526004549181019190915260055460608201526006546080820152919050565b610390610472565b6000546001600160a01b031633146103a757600080fd5b506040805160a08101825260025481526003546020820152600454918101919091526005546060820152600654608082015290565b6040805160808101825260008082526020820181905291810182905260608101919091526001600160a01b0382166000908152600b6020526040902060030154829060ff1615156001146104425760405162461bcd60e51b81526004016102c39061051d565b5050604080516080810182526007548152600854602082015260095491810191909152600a546060820152919050565b6040805160a08101825260008082526020820181905291810182905260608101829052608081019190915290565b80356001600160a01b03811681146104b757600080fd5b919050565b600080600080608085870312156104d257600080fd5b8435935060208501359250604085013591506104f0606086016104a0565b905092959194509250565b60006020828403121561050d57600080fd5b610516826104a0565b9392505050565b6020808252600e908201526d139bdd08185d5d1a1bdc9a5cd95960921b60408201526060019056fea2646970667358221220e49296f6e31e947d71f969212375c6204038de2d364b2f090518714d746b874064736f6c63430008090033";

type SmartHealthConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: SmartHealthConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class SmartHealth__factory extends ContractFactory {
  constructor(...args: SmartHealthConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    patientInfo: PromiseOrValue<BytesLike>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<SmartHealth> {
    return super.deploy(patientInfo, overrides || {}) as Promise<SmartHealth>;
  }
  override getDeployTransaction(
    patientInfo: PromiseOrValue<BytesLike>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(patientInfo, overrides || {});
  }
  override attach(address: string): SmartHealth {
    return super.attach(address) as SmartHealth;
  }
  override connect(signer: Signer): SmartHealth__factory {
    return super.connect(signer) as SmartHealth__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SmartHealthInterface {
    return new utils.Interface(_abi) as SmartHealthInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): SmartHealth {
    return new Contract(address, _abi, signerOrProvider) as SmartHealth;
  }
}

/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "./common";

export declare namespace SmartHealth {
  export type ProviderDataStruct = {
    hcpName: PromiseOrValue<BytesLike>;
    infoToAuth: PromiseOrValue<BytesLike>;
    reason: PromiseOrValue<BytesLike>;
    authorised: PromiseOrValue<boolean>;
  };

  export type ProviderDataStructOutput = [string, string, string, boolean] & {
    hcpName: string;
    infoToAuth: string;
    reason: string;
    authorised: boolean;
  };

  export type PatientSummaryStruct = {
    name: PromiseOrValue<BytesLike>;
    age: PromiseOrValue<BytesLike>;
    birthSex: PromiseOrValue<BytesLike>;
    weight: PromiseOrValue<BytesLike>;
    height: PromiseOrValue<BytesLike>;
  };

  export type PatientSummaryStructOutput = [
    string,
    string,
    string,
    string,
    string
  ] & {
    name: string;
    age: string;
    birthSex: string;
    weight: string;
    height: string;
  };

  export type PatientVitalsStruct = {
    heartRate: PromiseOrValue<BytesLike>;
    bloodPressure: PromiseOrValue<BytesLike>;
    oxygenSat: PromiseOrValue<BytesLike>;
    temperature: PromiseOrValue<BytesLike>;
  };

  export type PatientVitalsStructOutput = [string, string, string, string] & {
    heartRate: string;
    bloodPressure: string;
    oxygenSat: string;
    temperature: string;
  };
}

export interface SmartHealthInterface extends utils.Interface {
  functions: {
    "authorizeProvider(bytes32,bytes32,bytes32,address)": FunctionFragment;
    "getHCPDetails(address)": FunctionFragment;
    "getPatientSummary()": FunctionFragment;
    "getPatientSummaryHCP(address)": FunctionFragment;
    "getPatientVitals()": FunctionFragment;
    "getPatientVitalsHCP(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "authorizeProvider"
      | "getHCPDetails"
      | "getPatientSummary"
      | "getPatientSummaryHCP"
      | "getPatientVitals"
      | "getPatientVitalsHCP"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "authorizeProvider",
    values: [
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<string>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getHCPDetails",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "getPatientSummary",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getPatientSummaryHCP",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "getPatientVitals",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getPatientVitalsHCP",
    values: [PromiseOrValue<string>]
  ): string;

  decodeFunctionResult(
    functionFragment: "authorizeProvider",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getHCPDetails",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPatientSummary",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPatientSummaryHCP",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPatientVitals",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPatientVitalsHCP",
    data: BytesLike
  ): Result;

  events: {};
}

export interface SmartHealth extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: SmartHealthInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    authorizeProvider(
      hcpName: PromiseOrValue<BytesLike>,
      infoToAuth: PromiseOrValue<BytesLike>,
      reason: PromiseOrValue<BytesLike>,
      hcpAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getHCPDetails(
      hcpAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[SmartHealth.ProviderDataStructOutput]>;

    getPatientSummary(
      overrides?: CallOverrides
    ): Promise<[SmartHealth.PatientSummaryStructOutput]>;

    getPatientSummaryHCP(
      hcpAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[SmartHealth.PatientSummaryStructOutput]>;

    getPatientVitals(
      overrides?: CallOverrides
    ): Promise<[SmartHealth.PatientVitalsStructOutput]>;

    getPatientVitalsHCP(
      hcpAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[SmartHealth.PatientVitalsStructOutput]>;
  };

  authorizeProvider(
    hcpName: PromiseOrValue<BytesLike>,
    infoToAuth: PromiseOrValue<BytesLike>,
    reason: PromiseOrValue<BytesLike>,
    hcpAddress: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getHCPDetails(
    hcpAddress: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<SmartHealth.ProviderDataStructOutput>;

  getPatientSummary(
    overrides?: CallOverrides
  ): Promise<SmartHealth.PatientSummaryStructOutput>;

  getPatientSummaryHCP(
    hcpAddress: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<SmartHealth.PatientSummaryStructOutput>;

  getPatientVitals(
    overrides?: CallOverrides
  ): Promise<SmartHealth.PatientVitalsStructOutput>;

  getPatientVitalsHCP(
    hcpAddress: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<SmartHealth.PatientVitalsStructOutput>;

  callStatic: {
    authorizeProvider(
      hcpName: PromiseOrValue<BytesLike>,
      infoToAuth: PromiseOrValue<BytesLike>,
      reason: PromiseOrValue<BytesLike>,
      hcpAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    getHCPDetails(
      hcpAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<SmartHealth.ProviderDataStructOutput>;

    getPatientSummary(
      overrides?: CallOverrides
    ): Promise<SmartHealth.PatientSummaryStructOutput>;

    getPatientSummaryHCP(
      hcpAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<SmartHealth.PatientSummaryStructOutput>;

    getPatientVitals(
      overrides?: CallOverrides
    ): Promise<SmartHealth.PatientVitalsStructOutput>;

    getPatientVitalsHCP(
      hcpAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<SmartHealth.PatientVitalsStructOutput>;
  };

  filters: {};

  estimateGas: {
    authorizeProvider(
      hcpName: PromiseOrValue<BytesLike>,
      infoToAuth: PromiseOrValue<BytesLike>,
      reason: PromiseOrValue<BytesLike>,
      hcpAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getHCPDetails(
      hcpAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPatientSummary(overrides?: CallOverrides): Promise<BigNumber>;

    getPatientSummaryHCP(
      hcpAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPatientVitals(overrides?: CallOverrides): Promise<BigNumber>;

    getPatientVitalsHCP(
      hcpAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    authorizeProvider(
      hcpName: PromiseOrValue<BytesLike>,
      infoToAuth: PromiseOrValue<BytesLike>,
      reason: PromiseOrValue<BytesLike>,
      hcpAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getHCPDetails(
      hcpAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getPatientSummary(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getPatientSummaryHCP(
      hcpAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getPatientVitals(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getPatientVitalsHCP(
      hcpAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
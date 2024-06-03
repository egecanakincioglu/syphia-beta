type Awaitable<Input> = Input | Promise<Input>

type NullishStatementSuccessFunction<Input, Inputs extends readonly unknown[] = readonly unknown[]> = (input: Input, builder: StatementBuilder) => Awaitable<StatementBuilder<Inputs>>;
type NormalStatementFunction<Input> = (input: Input) => Awaitable<boolean>; 

interface NullishStatementOption<Input, Inputs extends readonly unknown[] = readonly unknown[]> {
  type: StatementType.Nullish;
  errorMessage: string;
  onSuccess?: NullishStatementSuccessFunction<Input, Inputs>;
}

interface NormalStatementOption<Input> {
  type: StatementType.Normal;
  errorMessage: string;
  statement: NormalStatementFunction<Input>;
}

interface NullishStatement<Input, Inputs extends readonly unknown[] = readonly unknown[]> extends NullishStatementOption<Input, Inputs> {
  input: Input
};

interface NormalStatement<Input> extends NormalStatementOption<Input> {
  input: Input,
}

type StatementOption<Input> = NormalStatementOption<Input> | NullishStatementOption<Input>
type Statement<Input extends unknown> = NormalStatement<Input> | NullishStatement<Input>;

type StatementExecuteResultData<Inputs extends readonly unknown[]> = {
  [Index in keyof Inputs]: Inputs[Index] extends NullishStatementInput<infer I, infer IS> ? [I, StatementExecuteResultData<IS>] : Inputs[Index];
};

interface StatementExecuteFail {
  status: StatementExecuteStatus.Fail;
  errorMessage: string;
}

interface StatementExecuteSuccess<Data extends readonly unknown[]> {
  status: StatementExecuteStatus.Success;
  data: StatementExecuteResultData<Data>;
}

type StatementExecuteResult<Data extends readonly unknown[]> = StatementExecuteFail | StatementExecuteSuccess<Data>;

export enum StatementExecuteStatus {
  Fail = "fail",
  Success = "success",
}

enum StatementType {
  Normal = "normal",
  Nullish = "nullish",
}

interface NullishStatementInput<Input extends unknown = unknown, Inputs extends readonly unknown[] = unknown[]> {
  input: Input;
  subInputs: Inputs;
}

export function isFailed<Data extends readonly unknown[]>(statement: StatementExecuteResult<Data>): statement is StatementExecuteFail {
  return statement.status === StatementExecuteStatus.Fail;
}

export class StatementBuilder<Inputs extends readonly unknown[] = []> {
  constructor(private builders: Statement<unknown>[] = []) {}

  public addNormalStatement<Input>(input: Input, errorMessage: string, statement: NormalStatementFunction<Input>): StatementBuilder<[...Inputs, Input]> {
    const options: NormalStatement<Input> = { input, type: StatementType.Normal, errorMessage, statement };
    return new StatementBuilder<[...Inputs, Input]>([...this.builders, options]);
  }

  public addNullishStatement<Input, SubInputs extends readonly unknown[]>(input: Input, errorMessage: string, onSuccess?: NullishStatementSuccessFunction<Input, SubInputs>): StatementBuilder<[...Inputs, NullishStatementInput<Input, SubInputs>]> {
    const options: NullishStatement<Input, SubInputs> = { input, type: StatementType.Nullish, errorMessage, onSuccess };
    return new StatementBuilder<[...Inputs, NullishStatementInput<Input, SubInputs>]>([...this.builders, options]);
  }


  public async execute(): Promise<StatementExecuteResult<Inputs>> {
    let error: string | undefined;
    const resultData = [];

    for (const builder of this.builders) {
      const { type, input, errorMessage } = builder;

      if (type === StatementType.Normal) {
        const result = await builder.statement(input);

        if (!result) {
          error = errorMessage;
          break;
        }

        resultData.push(input);
        continue;
      }

      if (input === null || input === undefined) {
        error = errorMessage;
        break;
      }

      if (!builder.onSuccess) {
        resultData.push([input]);
        continue;
      }

      const newStatements = await (await builder.onSuccess(input, new StatementBuilder())).execute();

      if (isFailed(newStatements)) {
        error = newStatements.errorMessage;
        break;
      }

      resultData.push([input, newStatements.data]);
    }

    if (error !== undefined) {
      return {
        status: StatementExecuteStatus.Fail,
        errorMessage: error,
      }
    }

    return {
      status: StatementExecuteStatus.Success,
      data: this.mapResult(resultData) as StatementExecuteResultData<Inputs>,
    }
  }

  private mapResult(input: unknown[]) {
    return input.map((i) => i !== null && typeof i === "object" && "status" in i && "data" in i && Array.isArray(i.data) && i.status === StatementExecuteStatus.Success ? [i, this.mapResult(i.data)] : i);
  }
}
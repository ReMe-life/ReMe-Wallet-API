export interface DataSourceConfig<TContext> {
    context: TContext;
}

export abstract class BaseDatabase<TContext = any> {

    public initialize?(config: DataSourceConfig<TContext>): void | Promise<void>;
    public all?(id: any): void | Promise<any>;
    public getById?(id: any): void | Promise<any>;
    public create?(document: any): void | Promise<void>;
    public update?(document: any): void | Promise<void>;

}

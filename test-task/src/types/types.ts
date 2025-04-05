export interface DataItem {
  dateTime: string;
  [country: string]: number | string | undefined;
}

export interface RawDataItem {
  DateTime: string;
  Country: string;
  Value: number;
  Category: string;
  Frequency: string;
}

type AggregatedData = {
  DateTime: string;
  [country: string]: number | string | undefined;
};

export type GroupedData = {
  [date: string]: AggregatedData;
};

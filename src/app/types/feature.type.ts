export interface IFeature {
  firearea: number | undefined;
  feature: {
    attrs: {
      address: string;
      application_date: string | null;
      area_type: string;
      area_unit: string;
      area_value: number;
      cad_cost: number;
      cad_unit: string;
      category_type: string;
      cc_date_approval: string;
      cc_date_entering: string;
      children: any | null;
      cn: string;
      date_cost: string;
      fp: any | null;
      id: string;
      is_big: false;
      kvartal: string;
      kvartal_cn: string;
      parcel_build: false;
      parcel_build_attrs: any | null;
      parcel_type: string;
      rifr: any | null;
      rifr_cnt: any | null;
      rifr_dep: any | null;
      rifr_dep_info: any | null;
      sale: any | null;
      sale_cnt: any | null;
      sale_date: any | null;
      sale_dep: any | null;
      sale_dep_uo: any | null;
      sale_doc_date: any | null;
      sale_doc_num: any | null;
      sale_doc_type: any | null;
      sale_price: any | null;
      statecd: string;
      util_by_doc: string;
      util_code: string;
    };
    center: {
      x: number;
      y: number;
    };
    extent: {
      xmax: number;
      xmin: number;
      ymax: number;
      ymin: number;
    };
    extent_parent: any | null;
    sort: number;
    stat: any;
    type: number;
    type_parent: any | null;
  };
}

export interface ISearchFeatures {
  features: ISearchFeature[];
  total: number;
  total_relation: string;
}

export interface ISearchFeature {
  attrs: {
    address: string;
    cn: string;
    id: string;
  };
  center: {
    x: number;
    y: number;
  };
  extent: {
    ymax: number;
    ymin: number;
    xmax: number;
    xmin: number;
  };
  sort: number;
  type: number;
}

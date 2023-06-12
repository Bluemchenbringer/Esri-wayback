import { IExtent } from '@esri/arcgis-rest-request';
import { getServiceUrl } from '@utils/Tier';
import { geographicToWebMercator } from '@arcgis/core/geometry/support/webMercatorUtils';
import Extent from '@arcgis/core/geometry/Extent';

type GPJobStatus =
    | 'esriJobSubmitted'
    | 'esriJobExecuting'
    | 'esriJobSucceeded'
    | 'esriJobFailed';

type SubmitJobParams = {
    /**
     * map extent of this job
     */
    extent: IExtent;
    /**
     * identifier of a wayback item (e.g. `WB_2014_R01`) that will be used as clump name
     */
    layerIdentifier: string;
    /**
     * user selected zoom levels
     */
    zoomLevels: number[];
};

type SubmitJobResponse = {
    jobId: string;
    jobStatus: GPJobStatus;
};

type CheckJobStatusResponse = {
    jobId: string;
    jobStatus: GPJobStatus;
    results?: {
        output: {
            paramUrl: string;
        };
    };
    progress?: {
        type?: string;
        message?: string;
    };
    messages?: {
        type?: string;
        description?: string;
    }[];
};

type GetJobOutputResponse = {
    paramName: string;
    dataType: string;
    value: {
        /**
         * @example
         * https://34.220.147.218:6443/arcgis/rest/directories/arcgisjobs/wayport_gpserver/j94219d68f2874618a5c778db93a1ed9b/scratch/wayport.tpkx
         */
        url: string;
    };
};

const WAYPORT_GP_SERVICE_ROOT = getServiceUrl('wayback-export-base');

export const submitJob = async ({
    extent,
    layerIdentifier,
    zoomLevels,
}: SubmitJobParams): Promise<SubmitJobResponse> => {
    const extentInWebMercator = geographicToWebMercator(
        new Extent(extent)
    ) as Extent;

    const [minZoom, maxZoom] = zoomLevels;

    const { xmin, ymin, xmax, ymax } = extentInWebMercator;

    const params = new URLSearchParams({
        f: 'json',
        clump: layerIdentifier,
        levels: `${minZoom}-${maxZoom}`,
        extent: `${xmin} ${ymin} ${xmax} ${ymax} PROJCS["WGS_1984_Web_Mercator_Auxiliary_Sphere",GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Mercator_Auxiliary_Sphere"],PARAMETER["False_Easting",0.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",0.0],PARAMETER["Standard_Parallel_1",0.0],PARAMETER["Auxiliary_Sphere_Type",0.0],UNIT["Meter",1.0]]`,
    });

    const res = await fetch(`${WAYPORT_GP_SERVICE_ROOT}/submitJob`, {
        method: 'post',
        body: params,
    });

    const data = await res.json();

    return data as SubmitJobResponse;
};

export const checkJobStatus = async (
    jobId: string
): Promise<CheckJobStatusResponse> => {
    const res = await fetch(`${WAYPORT_GP_SERVICE_ROOT}/jobs/${jobId}?f=json`);

    const data = await res.json();

    return data as CheckJobStatusResponse;
};

export const getJobOutput = async (
    jobId: string,
    paramUrl: string
): Promise<GetJobOutputResponse> => {
    const res = await fetch(
        `${WAYPORT_GP_SERVICE_ROOT}/jobs/${jobId}/${paramUrl}?f=json`
    );

    const data = await res.json();

    return data as GetJobOutputResponse;
};

/**
 * Utilities for extracting information from https://dash.deno.com/.
 *
 * @module
 */

import { state } from "./state.ts";

export interface DashRootData {
  user: DashUser;
  organizations: DashOrganization[];
  sudo: boolean;
}

export interface DashUser {
  id: string;
  login: string;
  name: string;
  avatarUrl: string;
  githubId: number;
  isBlocked: boolean;
  isAdmin: boolean;
  pro: boolean;
  subscription: {
    plan: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
  };
  features: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DashOrganization {
  id: string;
  name: string | null;
  pro: boolean;
  subscription: {
    plan: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
  };
  features: Record<string, boolean>;
  createdAt: string;
  updatedAt: string;
}

interface DashOrganizationMember {
  user: {
    id: string;
    login: string;
    name: string;
    avatarUrl: string;
  };
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

interface DashOrganizationDetail extends DashOrganization {
  members: DashOrganizationMember[];
  projects: DashProject[];
  quotas: Record<string, unknown>;
}

interface DashCommit {
  hash: string;
  message: string;
  authorName: string;
  authorEmail: string;
  authorGithubUsername: string;
  url: string;
}

interface DashDeploymentDetails {
  id: string;
  url: string;
  domainMappings: {
    domain: string;
    createdAt: string;
    updatedAt: string;
  }[];
  envVars: string[];
  isBlocked: boolean;
}

interface DashLogEntry {
  type: string;
  currentBytes: number;
  totalBytes: number;
}

interface DashDeployment {
  id: string;
  relatedCommit: null | DashCommit;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  deployment: DashDeploymentDetails;
  logs: DashLogEntry[];
}

interface DashProjectBase {
  id: string;
  name: string;
  productionDeployment: DashDeployment;
  hasProductionDeployment: boolean;
  organizationId: string;
  organization: DashOrganization;
  envVars: string[];
  createdAt: string;
  updatedAt: string;
}

interface DashProjectGit extends DashProjectBase {
  type: "git";
  git: {
    repository: {
      id: number;
      owner: string;
      name: string;
    };
    entrypoint: null | string;
    productionBranch: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface DashProjectPlayground extends DashProjectBase {
  type: "playground";
  playground: {
    snippet: string;
    mediaType: string;
    isPublic: boolean;
    manifest: null;
    entryPoint: null;
  };
}

export interface DashDb {
  branch: string;
  bindingName: string;
  databaseId: string;
  sizeBytes: number;
  featureFlags: string[];
  currentState: {
    regions: string[];
    primaryRegion: string;
    replicationJobIds: Record<string, unknown>;
  };
  ongoingModification: boolean;
  createdAt: string;
  updatedAt: string;
  availableRegions: string[];
}

export type DashProject = DashProjectGit | DashProjectPlayground;

const DENO_KV_ACCESS_TOKEN = "DENO_KV_ACCESS_TOKEN";
const DASH_BASE_URL = "https://dash.deno.com/";

export function setAccessToken(token: string, sessionToken?: boolean) {
  Deno.env.set(DENO_KV_ACCESS_TOKEN, token);
  state.accessToken.value = token;
  if (sessionToken) {
    state.sessionToken.value = token;
  }
}

export function clearAccessToken() {
  Deno.env.delete(DENO_KV_ACCESS_TOKEN);
  state.accessToken.value = undefined;
}

/** For the set access token, retrieve the root data, which includes information
 * about the user and any organizations they belong to. */
export async function getRootData(): Promise<DashRootData> {
  const req = await fetch(`${DASH_BASE_URL}_app?_data_`, {
    method: "GET",
    headers: {
      "Cookie": `token=${state.accessToken.value}`,
    },
  });
  if (req.status !== 200) {
    throw new Error(
      `Fetching Root Data: ${req.statusText}\n\n${await req.text()}`,
    );
  }
  return req.json();
}

/** For the user represented by the set access token, retrieve the projects for
 * that user. */
export async function getUserProjects(): Promise<DashProject> {
  const req = await fetch(`${DASH_BASE_URL}projects/index?_data_`, {
    method: "GET",
    headers: {
      "Cookie": `token=${state.accessToken.value}`,
    },
  });
  if (req.status !== 200) {
    throw new Error(
      `Fetching User Projects: ${req.statusText}\n\n${await req.text()}`,
    );
  }
  return req.json();
}

/** For a given project name, retrieve the project details. */
export async function getProjectDetails(name: string): Promise<DashProject> {
  const req = await fetch(`${DASH_BASE_URL}projects/${name}?_data_`, {
    method: "GET",
    headers: {
      "Cookie": `token=${state.accessToken.value}`,
    },
  });
  if (!req.ok) {
    throw new Error(
      `Fetch Project Details: ${req.statusText}\n\n${await req.text()}`,
    );
  }
  return req.json();
}

/** For a given organization, retrieve the organization details. */
export async function getOrganizationDetail(
  id: string,
): Promise<DashOrganizationDetail> {
  const req = await fetch(`${DASH_BASE_URL}orgs/${id}?_data_`, {
    method: "GET",
    headers: {
      "Cookie": `token=${state.accessToken.value}`,
    },
  });
  if (req.status !== 200) {
    throw new Error(
      `Fetching Org Details: ${req.statusText}\n\n${await req.text()}`,
    );
  }
  return req.json();
}

/** For a given project, retrieve the project's KV DB details. */
export async function getProjectDbs(name: string): Promise<DashDb[]> {
  const req = await fetch(`${DASH_BASE_URL}projects/${name}/kv?_data_`, {
    method: "GET",
    headers: {
      "Cookie": `token=${state.accessToken.value}`,
    },
  });
  if (!req.ok) {
    throw new Error(
      `Fetch KV Details: ${req.statusText}\n\n${await req.text()}`,
    );
  }
  const { dbList }: { dbList: DashDb[] } = await req.json();
  return dbList;
}

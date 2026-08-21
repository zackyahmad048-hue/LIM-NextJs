import { buildReportStats } from "../application/service";
import { twkService } from "../application/twk.service";

export async function listMembers(params: {
  search?: string;
  page?: number;
  limit?: number;
}) {
  return twkService.listMembers(params);
}

export async function getTwkReport() {
  const members = await twkService.findAllMembers();
  return { members, stats: buildReportStats(members) };
}

export async function getTwkMemberById(id: string) {
  return twkService.findMemberById(id);
}

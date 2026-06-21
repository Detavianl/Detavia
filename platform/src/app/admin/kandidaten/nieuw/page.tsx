import CandidateForm from "@/components/CandidateForm";
import { createCandidate } from "../actions";

export default function NieuweKandidaat() {
  return <CandidateForm action={createCandidate} />;
}

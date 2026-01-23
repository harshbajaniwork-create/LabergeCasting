import { redirect } from "react-router";

export function loader() {
  return redirect("/fr");
}

export default function Redirect() {
  return null;
}

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: () => (
    <div className="p-2">
      <h3 className="text-2xl font-bold">Home Page</h3>
      <p>Welcome to the home page!</p>
    </div>
  ),
});


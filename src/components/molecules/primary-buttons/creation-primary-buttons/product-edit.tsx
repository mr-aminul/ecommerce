import { Button } from "@/components/ui/button";

export default function EditProductPrimaryButtons() {
  return (
    <div className="flex gap-2">
      <Button className="space-x-1" type="submit">
        <span>Save changes</span>
      </Button>
    </div>
  );
}

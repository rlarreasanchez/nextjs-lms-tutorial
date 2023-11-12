import { UserButton } from "@clerk/nextjs";

const NavbarRoutes = () => {
  return (
    <div className="flex ml-auto gap-x-2">
      <UserButton />
    </div>
  );
};

export default NavbarRoutes;

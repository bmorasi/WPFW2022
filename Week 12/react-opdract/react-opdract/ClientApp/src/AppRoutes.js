import { Boek } from "./components/Boek";
import { Home } from "./components/Home";

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: '/Boek',
    element: <Boek />
  }
];

export default AppRoutes;

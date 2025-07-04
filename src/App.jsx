import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./view/pages/auth/Login/Login.jsx";
import DashboardLayout from "./view/layout/DashboardLayout/DashboardLayout.jsx";
import PrivateRoute from "./view/routes/PrivateRoute.jsx";
import {
  // Home,
  Dashboard,
  // Events,
  Gallery,
  Members,
  Messages,
  ContactUs,
  Profile,
  Subscribers,
  SocialMedia,
  OurProgrammes,
  NewsPage,
  SupportSpeak,
  Registration,
  Books,
  ContactDetails,
  getaquote,
} from "./view/pages/index.js";
import Artist from "./view/pages/Artist/Artist.jsx";
import GetAQuote from "./view/components/GetAQuote/GetAQuote.jsx";
import Product from "./view/components/Product/Product.jsx";
import Category from "./view/components/Category/Category.jsx";
import PageDetails from "./view/components/PageDetails/PageDetails.jsx";
import Booking from "./view/components/Booking/Booking.jsx";
import Products from "./view/components/Products/Products.jsx";
import Projects from "./view/components/Projects/Projects.jsx";
import SubCategory from "../src/view/components/SubCategory/SubCategory.jsx";
import GetInvolved from "./view/components/GetInvolved/GetInvolved.jsx";
import Awards from "./view/components/Awards/Awards.jsx";
import NewsAndStories from "./view/components/NewsAndStories/NewsAndStories.jsx";
import Events from "./view/components/Events/Events.jsx";
import TermsAndConditions from "./view/pages/TermsAndConditions/TermsAndConditions.jsx";
import PrivacyPolicy from "./view/pages/Privacy/PrivacyPolicy.jsx";
import Faq from "./view/pages/FAQ's/Faq.jsx";
import About from "./view/pages/About/About.jsx";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/home" element={<Home />} /> */}
        <Route path="/events" element={<Events />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/artist" element={<Artist />} />
        <Route path="/members" element={<Members />} />
        <Route path="/message" element={<Messages />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/contactdetails" element={<ContactDetails />} />
        <Route path="/getaquote" element={<GetAQuote />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/subscribers" element={<Subscribers />} />
        <Route path="/socialMedia" element={<SocialMedia />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/support-speakers" element={<SupportSpeak />} />
        <Route path="/register-user" element={<Registration />} />
        <Route path="/books" element={<Books />} />
        <Route path="/products" element={<Product />} />

        <Route path="/ourProgrammes" element={<OurProgrammes />} />

        <Route path="/category" element={<Category />} />
        <Route path="/page-details" element={<PageDetails />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/products" element={<Products />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/subcategory" element={<SubCategory />} />
        <Route path="/getinvolved" element={<GetInvolved />} />
        <Route path="/awards" element={<Awards />} />
        <Route path="/newsandstories" element={<NewsAndStories />} />
        <Route path="/events" element={<Events />} />

        <Route path="/termsandconditions" element={<TermsAndConditions />} />
        <Route path="/privarypolicy" element={<PrivacyPolicy />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/aboutus" element={<About />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;

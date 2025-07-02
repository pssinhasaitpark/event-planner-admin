import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/authslice";
import booklistReducer from "../slice/bookSlice";
import galleryReducer from "../slice/GallerySlice";

import profileReducer from "../slice/profileSlice";
import contactReducer from "../slice/contactusSlice";
import messageReducer from "../slice/messageSlice";
import bannerReducer from "../slice/bannerSlice";
import membersReducer from "../slice/membersSlice";
import supportSpeakReducer from "../slice/supportSpeakSlice";
import registrationReducer from "../slice/registrationSlice";
import subscribersReducer from "../slice/subscribersSlice";
import programmesReducer from "../slice/ourProgrammesSlice";
import socialMediaReducer from "../slice/socialMediaSlice";
import dashboardReducer from "../slice/dashboardSlice";
import eventVideosReducer from "../slice/eventVideoSlice";
import homeReducer from "../slice/homeSlice";
import newsReducer from "../slice/newsPageSlice";
import contactDetailsReducer from "../slice/contactDetailsSlice";
import getAQuoteReducer from "../slice/getAQuoteSlice";
import vanvasiSectionReducer from "../slice/vanvasiSectionSlice";
import newsAndStoriesReducer from "../slice/NewsAndStoriesSlice";
import pageDetailsReducer from "../slice/PageDetailsSlice";
import committeeOrTrusteeReducer from "../slice/CommitteeOrTrusteeSlice";
import registrationAndCertificatesReducer from "../slice/RegistrationAndCertificatesSlice";
import projectsReducer from "../slice/ProjectsSlice";
import subCategoryReducer from "../slice/SubCategorySlice";
import getInvolvedReducer from "../slice/getInvolvedSlice";
import awardsReducer from "../slice/awardsSlice";
import eventReducer from "../slice/eventSlice";
import artistReducer from "../slice/artistSlice";
import productReducer from "../slice/productSlice";
import categoryReducer from "../slice/CategorySlice";
import createCatogryReducer from "../slice/createCategorySlice";

const store = configureStore({
  reducer: {
    products: productReducer,
    categories: categoryReducer,
    createCategory: createCatogryReducer,
    auth: authReducer,
    booklist: booklistReducer,
    newsAndStories: newsAndStoriesReducer,
    gallery: galleryReducer,
    events: eventReducer,
    artist: artistReducer,
    artist: artistReducer,
    eventVideos: eventVideosReducer,
    profile: profileReducer,
    contact: contactReducer,
    message: messageReducer,
    banner: bannerReducer,
    pageDetails: pageDetailsReducer,
    category: categoryReducer,
    members: membersReducer,
    supportSpeak: supportSpeakReducer,
    registration: registrationReducer,
    subscribers: subscribersReducer,
    programmes: programmesReducer,
    socialMedia: socialMediaReducer,
    getInvolved: getInvolvedReducer,
    dashboard: dashboardReducer,
    home: homeReducer,
    news: newsReducer,

    contactDetails: contactDetailsReducer,
    getAQuote: getAQuoteReducer,
    vanvasi: vanvasiSectionReducer,
    committeeOrTrustee: committeeOrTrusteeReducer,
    registrationAndCertificates: registrationAndCertificatesReducer,
    projects: projectsReducer,
    subCategory: subCategoryReducer,
    awards: awardsReducer,
  },
});

export default store;

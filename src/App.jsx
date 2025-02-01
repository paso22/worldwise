import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import CityList from "./components/CityList.jsx";
import CountryList from "./components/CountryList.jsx";
import City from "./components/City.jsx";
import Form from "./components/Form.jsx";
import {CitiesProvider} from "./contexts/CitiesContext.jsx";
import {AuthProvider} from "./contexts/AuthContext.jsx";
import ProtectedRoute from "./pages/ProtectedRoute.jsx";
import {lazy, Suspense} from "react";
import SpinnerFullPage from "./components/SpinnerFullPage.jsx";

const Homepage = lazy(() => import ("./pages/Homepage.jsx"));
const Pricing = lazy(() => import ("./pages/Pricing.jsx"));
const Product = lazy(() => import ("./pages/Product.jsx"));
const ErrorPage = lazy(() => import ("./pages/ErrorPage.jsx"));
const AppLayout = lazy(() => import ("./pages/AppLayout.jsx"));
const Login = lazy(() => import ("./pages/Login.jsx"));

function App() {
    return (
        <AuthProvider>
            <CitiesProvider>
                <BrowserRouter>
                    <Suspense fallback={<SpinnerFullPage/>}>
                        <Routes>
                            <Route index element={<Homepage/>}/>
                            <Route path="/pricing" element={<Pricing/>}/>
                            <Route path="/product" element={<Product/>}/>
                            <Route path="/login" element={<Login/>}/>
                            <Route path="app" element={
                                <ProtectedRoute>
                                    <AppLayout/>
                                </ProtectedRoute>
                            }>
                                <Route index element={<Navigate to="cities" replace/>}/>
                                <Route path="cities" element={<CityList/>}/>
                                <Route path="cities/:id" element={<City/>}/>
                                <Route path="countries" element={<CountryList/>}/>
                                <Route path="form" element={<Form/>}/>
                            </Route>
                            <Route path="*" element={<ErrorPage/>}/>
                        </Routes>
                    </Suspense>
                </BrowserRouter>
            </CitiesProvider>
        </AuthProvider>
    )
}

export default App

import React from "react";
import {render, waitFor} from "@testing-library/react";
import LoginSSO from "./LoginSSO";

const mockLogin = jest.fn();
const mockGetLoginUrl = jest.fn();
const mockPush = jest.fn();
let mockSearch = "";

jest.mock("../../app/services/lumenApi", () => ({
    usePostLoginLumenMutation: () => [mockLogin],
    useLazyGetGalaxyLoginUrlQuery: () => [mockGetLoginUrl],
}));
jest.mock("react-redux", () => ({useDispatch: () => jest.fn()}));
jest.mock("react-router", () => ({
    useHistory: () => ({push: mockPush}),
    useLocation: () => ({search: mockSearch}),
}));
jest.mock("react-i18next", () => ({useTranslation: () => ({t: (key) => key})}));
jest.mock("react-hot-toast", () => ({error: jest.fn()}));
jest.mock("../../i18n", () => ({setLanguageFromUser: jest.fn()}));
jest.mock("../../common/components/spinner/Spinner", () => () => null);

const unwrapping = (promise) => ({unwrap: () => promise});

describe("LoginSSO", () => {
    const initialMode = process.env.REACT_APP_GALAXY_API_MODE;

    beforeEach(() => {
        jest.clearAllMocks();
        mockLogin.mockReturnValue(unwrapping(Promise.resolve({success: 0})));
        mockGetLoginUrl.mockReturnValue(unwrapping(new Promise(() => {})));
    });

    afterEach(() => {
        if (initialMode === undefined) {
            delete process.env.REACT_APP_GALAXY_API_MODE;
        } else {
            process.env.REACT_APP_GALAXY_API_MODE = initialMode;
        }
    });

    it("posts the legacy broker token by default", async () => {
        delete process.env.REACT_APP_GALAXY_API_MODE;
        mockSearch = "?token=abc%2Bdef";

        render(<LoginSSO/>);

        await waitFor(() => expect(mockLogin).toHaveBeenCalledWith({token: "abc%2Bdef"}));
        expect(mockGetLoginUrl).not.toHaveBeenCalled();
    });

    it("never asks the back for a Keycloak login URL in legacy mode", async () => {
        process.env.REACT_APP_GALAXY_API_MODE = "legacy";
        mockSearch = "";

        render(<LoginSSO/>);

        await waitFor(() => expect(mockLogin).toHaveBeenCalledWith({token: undefined}));
        expect(mockGetLoginUrl).not.toHaveBeenCalled();
    });

    it("starts the Keycloak login through the back in new mode", async () => {
        process.env.REACT_APP_GALAXY_API_MODE = "new";
        mockSearch = "";

        render(<LoginSSO/>);

        await waitFor(() => expect(mockGetLoginUrl).toHaveBeenCalled());
        expect(mockLogin).not.toHaveBeenCalled();
    });

    it("posts the Keycloak code and state in new mode", async () => {
        process.env.REACT_APP_GALAXY_API_MODE = "new";
        mockSearch = "?state=s1&code=c1";

        render(<LoginSSO/>);

        await waitFor(() => expect(mockLogin).toHaveBeenCalledWith({code: "c1", state: "s1"}));
        expect(mockGetLoginUrl).not.toHaveBeenCalled();
    });
});

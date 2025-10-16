import { AxiosInstance } from 'axios';
import { route as ziggyRoute } from 'ziggy-js';
import { PageProps as InertiaPageProps } from '@inertiajs/core';

export interface AuthUser {
    id: number;
    name: string;
    email: string;
}

declare global {
    interface Window {
        axios: AxiosInstance;
    }

    // ✅ global helper route()
    var route: typeof ziggyRoute;
}

export interface PageProps extends InertiaPageProps {
    auth?: {
        user?: AuthUser;
    };
    flash?: {
        success?: string;
        error?: string;
    };
}
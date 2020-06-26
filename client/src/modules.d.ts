type Module = {
    hot?: {
        accept: () => void;
    }
}

declare const module: Module;

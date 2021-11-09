const defaultState = {
    isLoading: true,

};

const common = (state = defaultState,action) => {
    switch (action.type) {
        default:
            return state;
    };
}
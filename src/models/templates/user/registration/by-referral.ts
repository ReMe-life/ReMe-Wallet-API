export const ByReferral = {
    required: [
        'firstName',
        'lastName',
        'email',
        'password',
        'referredBy',
        'wallet',
    ],
    subTemplates: {
        wallet: {
            required: [
                'address',
                'json'
            ],
            // @ts-ignore
            optional: []
        }
    },
    // @ts-ignore
    optional: []
}

import React from 'react';
import {
    ScrollView,
    StyleSheet,
    View,
    Text,
} from 'react-native';
import normalize from '../utils/normalize';


const PrivacyPolicyScreen = ({ navigation }) => {
    return (
        <ScrollView style={{
            backgroundColor: '#FFFF',
            paddingVertical: normalize(20),
        }}>
                <View style={styles.content}>
                    <View>
                        <View style={styles.display}>
                            {/* <Text style={styles.unicode}>{'\u0031'}</Text> */}
                            <Text style={styles.title}>Introduction</Text>
                        </View>
                        <Text style={styles.paragraph}>
                            At Cashingames (“Cashingames,” “we,” “our,” and/or “us”), we provide
                            an entertainment gaming and trivia platform for game-loving users to
                            play and win points virtually. In this Privacy Policy (the “Privacy
                            Policy”), we tell you what information we receive from Cashingames
                            users, the third-party service providers (“Service Partners”) we
                            interact with and the nature of our interaction, and how we use the
                            information.
                        </Text>
                    </View>
                    <View>
                        <View style={styles.display}>
                            {/* <Text style={styles.unicode}>{'\u0031'}</Text> */}
                            <Text style={styles.title}>Scope of this Privacy Policy</Text>
                        </View>
                        <Text style={styles.paragraph}>
                            At Cashingames, we respect the privacy of the users of our
                            application, websites, and related services (the “Platform”). This
                            privacy explains how we collect, use, and share information from
                            users. Beyond this Privacy Policy, your use of Cashingames is also
                            subject to our Terms and Conditions.
                        </Text>
                        <Text style={styles.paragraph}>
                            This Privacy Policy applies to information collected:
                        </Text>
                        <Text style={styles.paragraph}>
                            on our website, which is any webpage or webservice located under the
                            domain and subdomain of “cashingames.com”
                        </Text>
                        <Text style={styles.paragraph}>
                            via email, text, web service and other electronic messages between you
                            and our website.
                        </Text>
                        <Text style={styles.paragraph}>
                            This Privacy Policy does not apply to information collected:
                        </Text>
                        <Text style={styles.paragraph}>
                            offline or through any other means, including on any other websites
                            operated by any third party (including our Service Partners); or
                        </Text>
                        <Text style={styles.paragraph}>
                            by any third party (including our Service Partners), including through
                            any application or content (including advertising) that may link to or
                            be accessible from or on the Website.
                        </Text>
                    </View>
                    <View>
                        <View style={styles.display}>
                            {/* <Text style={styles.unicode}>{'\u0031'}</Text> */}
                            <Text style={styles.title}>Children Under the Age of 18</Text>
                        </View>
                        <Text style={styles.paragraph}>
                            Our Website is not intended for
                            children under 18 years of age. No one under age 18 may provide any
                            information to or on the Website. We do not knowingly collect personal
                            information from children under 18. If you are under 18, do not use or
                            provide any information on this Website or through any of its
                            features, use any of the interactive features of this Website, or
                            provide any information about yourself to us, including your name,
                            address, telephone number, or email address. If we learn we have
                            collected or received personal information from a child under 18
                            without verification of parental consent, we will delete that
                            information. If you believe we might have any information from or
                            about a child under 18, please contact us at <Text>hello@cashingames.com.</Text>
                        </Text>
                    </View>
                    <View>
                        <View style={styles.display}>
                            {/* <Text style={styles.unicode}>{'\u0031'}</Text> */}
                            <Text style={styles.title}>Information We Collect and Mode of Collection</Text>
                        </View>
                        <Text style={styles.paragraph}>
                            1) Information About You:
                        </Text>
                        <Text style={styles.paragraph}>
                            When you sign up for a Cashingames account, you provide your name,
                            email address, and phone number. If you sign up using one of your
                            social media accounts, we will have access to basic information
                            from your social media profile such as, your name, gender, profile
                            photo, and social media connections.
                        </Text>
                        <Text style={styles.paragraph}>
                            2) Payment Information:
                        </Text>
                        <Text style={styles.paragraph}>
                            To access our games, users must pay prior to accessing. We use
                            payment channels through Service Partners to collect payment. When
                            you add a credit card or debit card to your account, a third-party
                            Service Partner handles payment for us, and will receive your card
                            information. To secure your financial data, we do not store full
                            credit card information on our servers.
                        </Text>
                        <Text style={styles.paragraph}>
                            3) Information Received from Communicating with Us:
                        </Text>
                        <Text style={styles.paragraph}>
                            If you contact our Customer Support Team, we may receive
                            additional information about you. For example, will receive your
                            name, email address, phone number, the contents of a message or
                            attachments, if any, sent to us, and other information you
                            provide.
                        </Text>
                        <Text style={styles.paragraph}>
                            4) Device Information:
                        </Text>
                        <Text style={styles.paragraph}>
                            When you access our website, we receive information from your
                            devices, including IP address, web browser type, mobile operating
                            system version, phone carrier and manufacturer, application
                            installations, device identifiers, mobile advertising identifiers,
                            push notification tokens. If you register with your social media
                            account, we receive your social media identifier. We also collect
                            mobile sensor data from devices (such as speed, direction, height,
                            acceleration or deceleration) to analyze and improve predictions
                            on usage patterns.
                        </Text>
                        <Text style={styles.paragraph}>
                            5) Usage Information and Preferences:
                        </Text>
                        <Text style={styles.paragraph}>
                            To help us understand how you use our Platform and improve our
                            service offering, we information about your interactions with our
                            Platform, your preferred game selections and frequency of play,
                            other content you view, your actions within our platform, and the
                            dates and times of your visits.
                        </Text>
                        <Text style={styles.paragraph}>
                            6) User Feedback:
                        </Text>
                        <Text style={styles.paragraph}>
                            Users are invited to rate and review our services on the Platform.
                            We receive information about ratings and reviews and store the
                            information solely to aid us in improving our service offerings.
                        </Text>
                        <Text style={styles.paragraph}>
                            7) Information from Cookies and Similar Technologies:
                        </Text>
                        <Text style={styles.paragraph}>
                            We collect information through “cookies”, tracking pixels, and
                            similar technologies to understand how you navigate our Platform
                            and interact with our advertisements. The aim is to learn what
                            content is relevant for you and to save your preferences. Cookies
                            are small text files that web servers place on your device,
                            designed to store basic information and to help websites and apps
                            recognize your browser.
                        </Text>
                        <Text style={styles.paragraph}>
                            We may use both session cookies and persistent cookies. A session
                            cookie disappears after you close your browser. A persistent
                            cookie remains after you close your browser and may be accessed
                            every time you use our Platform. You should consult your web
                            browser(s) to modify your cookie settings. Please note that if you
                            delete or choose not to accept cookies from us, you may miss out
                            on certain features on our Platform.
                        </Text>
                    </View>
                    <View>
                        <View style={styles.display}>
                            {/* <Text style={styles.unicode}>{'\u0031'}</Text> */}
                            <Text style={styles.title}>Sharing Information outside Cashingames</Text>
                        </View>
                        <Text style={styles.paragraph}>
                            Cashingames may be required to share user information with Service
                            Partners performing tasks on our behalf and with other companies,
                            organizations, government bodies, and individuals outside Cashingames
                            where we have a legitimate legal reason for doing so (for example, in
                            connection with any merger or acquisition) or
                        </Text>
                        <Text style={styles.paragraph}>
                            Whenever legally possible, we ensure we undertake measures to protect
                            the information we share by imposing contractual privacy and security
                            safeguards on the recipient of the information. In some cases,
                            however, it’s not possible for us to do so — for example, when we have
                            a legal obligation to disclose information to a government authority
                            and that government authority isn’t willing to enter into such
                            contractual safeguards.
                        </Text>
                    </View>
                    <View>
                        <View style={styles.display}>
                            {/* <Text style={styles.unicode}>{'\u0031'}</Text> */}
                            <Text style={styles.title}>Information Security</Text>
                        </View>
                        <Text style={styles.paragraph}>
                            We take appropriate administrative, technical and organizational
                            measures designed to help protect information about users from loss,
                            theft, misuse and unauthorized access, disclosure, alteration and
                            destruction. The safety and security of your information also depends
                            on you. Where we have given you (or where you have chosen) a means to
                            access certain parts of our Website, you are responsible for keeping
                            this confidential. We ask you not to share your security details with
                            anyone.
                        </Text>
                        <Text style={styles.paragraph}>
                            Unfortunately, the transmission of information via the internet is not
                            completely secure. Although we do our best to protect your personal
                            information, we cannot guarantee the security of your personal
                            information transmitted to our Website. Any transmission of personal
                            information is at your own risk. We are not responsible for
                            circumvention of any privacy settings or security measures contained
                            on the Website.
                        </Text>
                        <Text style={styles.paragraph}>
                            In each case of an information breach, we carry out an investigation,
                            quickly inform regulators (if required), and users of the breach, and
                            be specific with respect to what information was impacted and how the
                            issue will be addressed moving forward, within 72 hours of identifying
                            the breach.
                        </Text>
                    </View>
                    <View>
                        <View style={styles.display}>
                            {/* <Text style={styles.unicode}>{'\u0031'}</Text> */}
                            <Text style={styles.title}>Information Storage</Text>
                        </View>
                        <Text style={styles.paragraph}>
                            We store and process information in a secure and encrypted manner at
                            cloud storage in a manner compliant with the Nigeria Data Protection
                            Regulation (“NDPR”) of 2019. We do not store information beyond the
                            time prescribed by law unless we have a legitimate legal reason to
                            store information for a longer period – for example, where we are
                            under a binding legal order not to destroy information.
                        </Text>
                    </View>
                    <View>
                        <View style={styles.display}>
                            {/* <Text style={styles.unicode}>{'\u0031'}</Text> */}
                            <Text style={styles.title}>Disclosure of Personally Identifiable Information (PII)</Text>
                        </View>
                        <Text style={styles.paragraph}>
                            Unless required by law, we never disclose PII without seeking and
                            obtaining express written consent from the user prior to disclosure.
                            When seeking consent, the purpose of the disclosure must be explicitly
                            stated to enable the user to make an informed disclosure prior to
                            granting consent. If consent is obtained, we shall take necessary
                            measures to limit disclosure to the scope/purpose necessitating the
                            disclosure. Users are at liberty to refuse consent and it will not
                            hinder the user from accessing our Platform.
                        </Text>
                    </View>
                    <View>
                        <View style={styles.display}>
                            {/* <Text style={styles.unicode}>{'\u0031'}</Text> */}
                            <Text style={styles.title}>Use of PPII for Marketing and Advertising Purposes</Text>
                        </View>
                        <Text style={styles.paragraph}>
                            We never use PII for marketing and advertising purposes unless express
                            written consent is sought and obtained from the user prior to
                            publishing the advert or campaign. Users are at liberty to refuse
                            consent and it will not hinder the user from accessing our Platform.
                            If consent is obtained, we shall take necessary measures to limit
                            disclosure of identifiable information by anonymisation, where
                            feasible, and limiting the scope of the information disclosed.
                        </Text>
                    </View>
                    <View>
                        <View style={styles.display}>
                            {/* <Text style={styles.unicode}>{'\u0031'}</Text> */}
                            <Text style={styles.title}>The Use of Service Partners for Processing PII</Text>
                        </View>
                        <Text style={styles.paragraph}>
                            As stated earlier, we use Service Partners for processing payment. We
                            may also utilise the services of subcontractor(s) to for other
                            services requiring the processing of PII. Each Service Partner is
                            under the same obligation(s) to handle PII as would be expected of us.
                            We shall inform the users where there will be processing of PII by a
                            Service Partner.
                        </Text>
                        <Text style={styles.paragraph}>
                            We protect the security of PII processed by Service Partner(s) by
                            ensuring that the processes utilized by Service Partner(s) specify the
                            minimum technical, organisational standards and information security
                            required, as captured in the agreements between us and the Service
                            Partner(s).
                        </Text>
                    </View>
                    <View>
                        <View style={styles.display}>
                            {/* <Text style={styles.unicode}>{'\u0031'}</Text> */}
                            <Text style={styles.title}>Handling PII Security Breaches</Text>
                        </View>
                        <Text style={styles.paragraph}>
                            Although we implement the highest measures to protect PII, security
                            breaches may occur despite best security practices. In the event of a
                            breach, we shall promptly notify the user via email provided in their
                            account of the nature of the breach and remedial measures taken to
                            minimize the effect of the breach. If we determine that the
                            supervisory authority needs to be informed, the supervisory authority
                            shall be informed in writing within 72 hours of the breach.
                        </Text>
                    </View>
                    <View>
                        <View style={styles.display}>
                            {/* <Text style={styles.unicode}>{'\u0031'}</Text> */}
                            <Text style={styles.title}>Your Rights</Text>
                        </View>
                        <Text style={styles.paragraph}>
                            You have the right to withdraw your consent to the processing of your
                            information at any time, without affecting the lawfulness of
                            processing based on consent before its withdrawal.
                        </Text>
                        <Text style={styles.paragraph}>
                            If you would like to access a copy of your information, have your
                            information deleted, or otherwise exercise control over how your
                            information is used, please contact us at <Text>hello@cashingames.com.</Text>
                        </Text>
                    </View>
                    <View>
                        <View style={styles.display}>
                            {/* <Text style={styles.unicode}>{'\u0031'}</Text> */}
                            <Text style={styles.title}>Changes to Our Privacy Policy</Text>
                        </View>
                        <Text style={styles.paragraph}>
                            It is our policy to post any changes we make to our privacy policy on
                            this page. If we make material changes to how we treat our users’
                            personal information, we will notify you through a notice on the
                            website home page and we will share the policy with all our clients
                            through email. The date the privacy policy was last revised is
                            identified at the top of the page. You are responsible for ensuring we
                            have an up-to-date active and deliverable email address for you, and
                            for periodically visiting our Website and this privacy policy to check
                            for any changes.
                        </Text>
                    </View>
                    <View>
                        <View style={styles.display}>
                            {/* <Text style={styles.unicode}>{'\u0031'}</Text> */}
                            <Text style={styles.title}>Contacting Cashingames</Text>
                        </View>
                        <Text style={styles.paragraph}>
                            If you would like more information about how we collect and use
                            information, or other related questions, please contact us at <Text>hello@cashingames.com.</Text>
                        </Text>
                        <Text style={styles.paragraph}>
                            If you need to raise a concern with our Supervisory Authority, you can
                            contact NITDA <Text>https://nitda.gov.ng/nit/contact-us</Text>
                        </Text>
                    </View>
                </View>
        </ScrollView>
    )
}
export default PrivacyPolicyScreen;

const styles = StyleSheet.create({
    content: {
        justifyContent: 'space-between',
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: 50,
    },
    display: {
        flexDirection: 'row',
    },
    unicode: {
        color: '#151C2F',
        fontSize: 18,
        fontFamily: 'graphik-bold',
    },
    title: {
        flex: 1,
        paddingLeft: 5,
        color: '#151C2F',
        fontSize: 18,
        fontFamily: 'graphik-bold',
    },
    paragraph: {
        color: '#6c757dcc',
        fontFamily: 'graphik-regular',
        fontSize: 14,
        lineHeight: 22,
    },
})
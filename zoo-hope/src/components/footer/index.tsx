import "../../styles/index.scss";
import { createElements } from "../../data/footer";
import LogoNavBar from "../../images/logo/logo-white.png";
import { FooterNavBlockLink } from "../footerNavBlockLink";
import { FooterBottomText } from "../footerBottomText";
import { FooterNavContactsBlock } from "../footerNavContactsBlock";
import { FooterNavBlock } from "../footerNavBlock";
import { useEffect, useState } from "react";
import instLogo from '../../images/logo/Instagram.svg';
import facebookLogo from '../../images/logo/facebook.svg';
import { IContact } from "../../define";
import { getAllContacts } from "../../api/contacts";
import { useTranslation } from "react-i18next";

export const Footer = () => {
  const { t } = useTranslation();
  const [elements, setElements] = useState<Array<object>>()
  const [contacts, setContacts] = useState<IContact[]>([]);

  const isPhoneNumber = (url: string) => {
    const onlyDigits = /^\d+$/.test(url);
    const startsWithPlusAndDigits = /^\+\d+$/.test(url);
    return onlyDigits || startsWithPlusAndDigits;
  };

  useEffect(() => {
    createElements().then(el => setElements(el));
    getAllContacts().then(setContacts);
    console.log(contacts);

  }, [])

  if (!elements) {
    return <></>;
  }

  return (
    <footer id="footer" className="footer">
      <div className="footer__container">
        <div className="footer__logo-area">
          <img src={LogoNavBar} alt="zoonadia" className="footer__logo-img" />
          <p className="footer__logo-text">zoonadia</p>
        </div>
        <div className="footer__navigation">
          {elements.filter((e: any) => e.listName).map((e: Object, i: number) =>
          (
            <FooterNavBlock key={i} props={e} />
          )
          )}
        </div>

        <div className="footer__contacts">
          <div className="footer__contacts-social-media">
            {contacts.map((contact: IContact, index: number) => (
              contact.url!.includes('www.instagram.com') ? (
                <a href={contact.url} key={index}>
                  <img src={instLogo} alt={contact.name.en} />
                </a>
              ) : contact.url!.includes('facebook.com') ? (
                <a href={contact.url} key={index}>
                  <img src={facebookLogo} alt={contact.name.en} />
                </a>
              ) : contact.icon !== null ? (
                <a href={contact.url} key={index}>
                  <img src={contact.icon} alt={contact.name.en} />
                </a>
              ) : null
            ))}
          </div>


          <div className="footer__contacts-email-num" >
            {contacts.map((contact: IContact, index: number) => (
              contact.url!.includes('gmail.com') ? (
                <p key={index}>{t("email")} {contact.url}</p>
              ) : isPhoneNumber(contact.url!) ? (
                <p key={index}>{t("phone")} {contact.url}</p>
              ) : null
            ))}
          </div>


        </div>

        <div className="footer__bottom footer-bottom">
          {elements.map((e: Object, i: number) => {
            return (
              e.hasOwnProperty("footerBottomText") && (
                <FooterBottomText key={i} props={e} />
              )
            );
          })}
        </div>
      </div>
    </footer >
  );
};
